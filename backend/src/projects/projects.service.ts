import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model, Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectInvite, ProjectInviteDocument } from './project-invite.schema';
import { Project, ProjectDocument } from './project.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(ProjectInvite.name) private readonly inviteModel: Model<ProjectInviteDocument>,
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  async findAll(userId: string) {
    return this.projectModel
      .find({
        $or: [{ ownerId: userId }, { 'members.userId': new Types.ObjectId(userId) }],
      })
      .sort({ updatedAt: -1 })
      .lean();
  }

  async create(userId: string, dto: CreateProjectDto) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return this.projectModel.create({
      ...dto,
      ownerId: new Types.ObjectId(userId),
      members: [
        {
          userId: new Types.ObjectId(userId),
          name: user.name,
          email: user.email,
          role: 'owner',
        },
      ],
    });
  }

  async invite(userId: string, projectId: string, email: string) {
    const project = await this.projectModel.findOne({ _id: projectId, ownerId: userId });
    if (!project) {
      throw new ForbiddenException('Only the project owner can invite teammates');
    }

    const token = randomBytes(24).toString('hex');
    const invite = await this.inviteModel.create({
      projectId: project._id,
      invitedBy: new Types.ObjectId(userId),
      email,
      token,
    });
    const frontendUrl = this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const acceptUrl = `${frontendUrl}/invite/accept?token=${token}`;
    const subject = encodeURIComponent(`Invitation to join ${project.name}`);
    const body = encodeURIComponent(`You have been invited to join ${project.name}.\n\nAccept here: ${acceptUrl}`);

    return {
      id: invite._id.toString(),
      email: invite.email,
      status: invite.status,
      acceptUrl,
      mailtoHref: `mailto:${invite.email}?subject=${subject}&body=${body}`,
    };
  }

  async accept(userId: string, token: string) {
    const invite = await this.inviteModel.findOne({ token, status: 'pending' });
    if (!invite) {
      throw new NotFoundException('Invite not found or already accepted');
    }

    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const project = await this.projectModel.findById(invite.projectId);
    if (!project) throw new NotFoundException('Project not found');

    const alreadyMember = project.members.some((member) => member.userId.toString() === userId);
    if (!alreadyMember) {
      project.members.push({
        userId: new Types.ObjectId(userId),
        name: user.name,
        email: user.email || invite.email,
        role: 'member',
        joinedAt: new Date(),
      });
      await project.save();
    }

    invite.status = 'accepted';
    invite.acceptedAt = new Date();
    await invite.save();

    return project.toObject();
  }

  async leave(userId: string, projectId: string) {
    const project = await this.projectModel.findById(projectId);
    if (!project) throw new NotFoundException('Project not found');
    if (project.ownerId.toString() === userId) {
      throw new ForbiddenException('Project owner cannot leave. Delete the project instead.');
    }

    const beforeCount = project.members.length;
    project.members = project.members.filter((member) => member.userId.toString() !== userId);
    if (project.members.length === beforeCount) {
      throw new NotFoundException('Project membership not found');
    }

    await project.save();
    return { ok: true };
  }

  async remove(userId: string, projectId: string) {
    const project = await this.projectModel.findOne({ _id: projectId, ownerId: userId });
    if (!project) {
      throw new ForbiddenException('Only the project owner can delete this project');
    }

    await this.inviteModel.deleteMany({ projectId: project._id });
    await this.projectModel.findByIdAndDelete(project._id);
    return { ok: true };
  }
}

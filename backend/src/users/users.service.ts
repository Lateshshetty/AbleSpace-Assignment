import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

type GoogleProfile = {
  googleId: string;
  name: string;
  email?: string;
  avatar?: string;
};

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  createGuest() {
    return this.userModel.create({
      name: 'Guest User',
      isGuest: true,
    });
  }

  async findOrCreateGoogleUser(profile: GoogleProfile) {
    const existing = await this.userModel.findOne({ googleId: profile.googleId });
    if (existing) {
      existing.name = profile.name;
      existing.email = profile.email;
      existing.avatar = profile.avatar;
      return existing.save();
    }

    return this.userModel.create({
      googleId: profile.googleId,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      isGuest: false,
    });
  }

  findById(id: string) {
    return this.userModel.findById(id).lean();
  }

  async updateProfile(id: string, input: { name?: string; email?: string; avatar?: string }) {
    return this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            ...(input.name ? { name: input.name } : {}),
            ...(input.email ? { email: input.email } : {}),
            ...(input.avatar !== undefined ? { avatar: input.avatar } : {}),
          },
        },
        { new: true, runValidators: true },
      )
      .lean();
  }
}

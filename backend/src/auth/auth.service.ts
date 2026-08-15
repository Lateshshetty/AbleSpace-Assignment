import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async guestLogin() {
    const user = await this.usersService.createGuest();
    return this.issueToken(user.id);
  }

  async googleLogin(profile: {
    googleId: string;
    name: string;
    email?: string;
    avatar?: string;
  }) {
    const user = await this.usersService.findOrCreateGoogleUser(profile);
    return this.issueToken(user.id);
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isGuest: user.isGuest,
    };
  }

  async updateMe(userId: string, input: { name?: string; email?: string; avatar?: string }) {
    const user = await this.usersService.updateProfile(userId, input);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isGuest: user.isGuest,
    };
  }

  private issueToken(userId: string) {
    return {
      accessToken: this.jwtService.sign({ sub: userId }),
    };
  }
}

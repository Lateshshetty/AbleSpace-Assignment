import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthenticatedRequest } from '../common/authenticated-request';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('guest')
  guest() {
    return this.authService.guestLogin();
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  google() {
    return;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() request: AuthenticatedRequest, @Res() response: Response) {
    const result = await this.authService.googleLogin({
      googleId: request.user.userId,
      name: request.user.name,
      email: request.user.email,
    });
    const frontendUrl = this.config.getOrThrow<string>('FRONTEND_URL');
    response.redirect(`${frontendUrl}/auth/callback?token=${encodeURIComponent(result.accessToken)}`);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@Req() request: AuthenticatedRequest) {
    return this.authService.me(request.user.userId);
  }

  @Post('logout')
  logout() {
    return { ok: true };
  }
}


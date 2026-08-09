import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    const backendUrl = config.get<string>('BACKEND_URL') || 'http://localhost:3001';
    super({
      clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${backendUrl}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) {
    const email = profile.emails?.[0]?.value;
    const avatar = profile.photos?.[0]?.value;
    done(null, {
      userId: profile.id,
      name: profile.displayName || email || 'Google User',
      email,
      avatar,
      isGuest: false,
    });
  }
}


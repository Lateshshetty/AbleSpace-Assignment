import { IsEmail } from 'class-validator';

export class InviteProjectDto {
  @IsEmail()
  email: string;
}


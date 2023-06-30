import { IsEmail } from 'class-validator';

export class UpdateUser {
  @IsEmail()
  email: string;
}

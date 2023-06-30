import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  usernameOrEmail: string;

  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  password: string;
}

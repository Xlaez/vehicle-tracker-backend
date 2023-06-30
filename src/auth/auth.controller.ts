import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ResetPasswordDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<string | Error> {
    return this.authService.registerUser(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  async verifyEmail(@Body() code: string): Promise<any> {
    return this.authService.verifyAccount(code);
  }

  @HttpCode(HttpStatus.OK)
  @Post('request-password-reset')
  async requestResetPassword(@Body() body: { email: string }): Promise<any> {
    return this.authService.requestPassswordReset(body.email);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto): Promise<any> {
    return this.authService.resetPassword(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<any> {
    const { accessDuraton, accessToken, refreshDuration, refreshToken, user } =
      await this.authService.login(dto);
    const response = {
      tokens: {
        access: {
          token: accessToken,
          duration: accessDuraton,
        },
        refresh: {
          token: refreshToken,
          duration: refreshDuration,
        },
      },
      user,
    };
    return response;
  }
}

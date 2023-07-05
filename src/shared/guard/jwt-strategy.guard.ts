import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (info instanceof TokenExpiredError)
      throw new UnauthorizedException('auth token has expired');
    if (info instanceof Error)
      throw new UnauthorizedException('provide a valid jwt token');

    return super.handleRequest(err, user, info, context, status);
  }
}

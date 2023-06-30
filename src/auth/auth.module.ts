import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from 'src/strategy';
import * as moment from 'moment';
import { User, UserSchema } from 'src/user/schema';
import { MailService } from 'src/mail/mail.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return { secret: configService.get<string>('JWT_AUTH_SECRET') };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
      { name: User.name, schema: UserSchema },
    ]),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: `smtp://${process.env.SMTP_USER}:${process.env.SMTP_PASS}@smtp.gmail.com`,
        defaults: {
          from: '"vehicle tracker" <noreply@test.com>',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    MailService,
    RedisService,
    { provide: 'MomentWrapper', useValue: moment },
  ],
})
export class AuthModule {}

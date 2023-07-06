/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './schema';
import { Model } from 'mongoose';
import moment from 'moment';
import { UserService } from '../user';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IPayload } from '../../shared';
import { UserDocument } from '../user';
import { AppException } from '../../core';
import { LoginDto, RegisterDto, ResetPasswordDto } from './dto';
import { uniqueSixDigits } from '../../shared';
import { hash, verify } from 'argon2';
import { MailService } from '../../shared';
import { RedisService } from '../../core';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Token.name) protected TokenSchema: Model<TokenDocument>,
    @Inject(forwardRef(() => UserService)) private userServce: UserService,
    @Inject(forwardRef(() => MailService)) private mailService: MailService,
    @Inject(forwardRef(() => RedisService)) private redisService: RedisService,
    @Inject('MomentWrapper') protected momentWrapper: moment.Moment,
    protected jwt: JwtService,
    protected config: ConfigService,
  ) {}

  registerUser = async (dto: RegisterDto): Promise<string> => {
    try {
      if (await this.userServce.getUserByEmail(dto.email))
        throw new AppException({
          error: 'email in use by another user',
          status: HttpStatus.BAD_REQUEST,
        });
      if (await this.userServce.getUserByUsername(dto.username))
        throw new AppException({
          error: 'a user is already using this username',
          status: HttpStatus.BAD_REQUEST,
        });
      await this.userServce.saveUser(dto);
      const verificationCode = uniqueSixDigits();
      // console.log(verificationCode);
      // ADD CODE TO REDIS
      await this.redisService.insert(verificationCode.toString(), dto.email);
      // SEND MAIL
      await this.mailService.sendMail(
        dto.email,
        'Verify Your Account',
        dto.username,
        verificationCode.toString(),
      );
      return 'account created';
    } catch (e) {
      throw new AppException({
        error: 'an error occured',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  };

  login = async (dto: LoginDto) => {
    try {
      const user = await this.userServce.getUserOne({
        $or: [
          { email: dto.usernameOrEmail },
          { username: dto.usernameOrEmail },
        ],
      });
      if (!user)
        throw new AppException({
          error: 'incorrect login credentials',
          status: HttpStatus.BAD_REQUEST,
        });
      if (!user.isEmailVerified)
        throw new BadRequestException('verify email in order to login');
      if (!(await verify(user.password, dto.password)))
        throw new AppException({
          error: 'incorrect login credentials',
          status: HttpStatus.BAD_REQUEST,
        });
      const { accessDuraton, accessToken, refreshDuration, refreshToken } =
        await this.generateAuthTokens(user);
      await this.saveToken(
        refreshToken,
        user._id.toHexString(),
        refreshDuration,
        'refresh',
      );
      return {
        accessDuraton,
        accessToken,
        refreshDuration,
        refreshToken,
        user,
      };
    } catch (e) {
      throw new AppException(e);
    }
  };

  verifyAccount = async (verificationCode: any) => {
    try {
      // Get user from redis
      const email = await this.redisService.get(verificationCode.code);
      if (!email)
        throw new NotFoundException(
          'six digits code is incorrect or has expired',
        );
      const user = await this.userServce.getUserByEmail(email);
      if (!user)
        throw new AppException({
          error: 'unexpected result, request for a new code',
          status: HttpStatus.EXPECTATION_FAILED,
        });
      user.isEmailVerified = true;
      await this.redisService.remove(verificationCode.code);
      return user.save();
    } catch (e) {
      throw new AppException(e);
    }
  };

  requestPassswordReset = async (email: string) => {
    const user = await this.userServce.getUserByEmail(email);
    if (!user)
      throw new NotFoundException(
        'user with this email not found, check the password and retry',
      );
    const verificationCode = uniqueSixDigits();
    await this.redisService.insert(verificationCode.toString(), email);
    await this.mailService.sendMail(
      email,
      'Your Password Reset Code',
      user.username,
      verificationCode.toString(),
    );
    return 'success';
  };

  resetPassword = async (dto: ResetPasswordDto) => {
    const email = await this.redisService.get(dto.code);
    if (!email)
      throw new BadRequestException('code is incorrect or has expired');
    const user = await this.userServce.getUserByEmail(email);
    if (!user)
      throw new AppException({
        error: 'unexpected result, request for a new code',
        status: HttpStatus.EXPECTATION_FAILED,
      });
    user.password = await hash(dto.password);
    await this.redisService.remove(dto.code);
    return user.save();
  };

  refreshTokens = async (token: string) => {
    try {
      const refreshTokenDoc = await this.verifyToken(token);
      const user = await this.userServce.getUserById(
        refreshTokenDoc.tokenDoc.sub,
      );
      if (!user)
        throw new AppException({
          error: 'token has expired or is invalid',
          status: HttpStatus.BAD_REQUEST,
        });
      await this.TokenSchema.deleteOne({ token: refreshTokenDoc.token });
      const tokens = await this.generateAuthTokens(user);
      return { tokens, user };
    } catch (e) {
      throw new AppException({
        error: e,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  };

  /**
   * UTILITIES
   */
  signToken = async (userId: string, expires: moment.Moment) => {
    const payload: IPayload = {
      sub: userId,
      //@ts-ignore
      iat: this.momentWrapper().unix(),
      exp: expires.unix(),
    };
    return this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_AUTH_SECRET'),
    });
  };

  generateAuthTokens = async (user: UserDocument) => {
    try {
      const accessDuraton = this.config.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION',
      );
      const refreshDuration = this.config.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION',
      );
      const accessToken = await this.signToken(
        user._id.toHexString(),
        //@ts-ignore
        this.momentWrapper().add(accessDuraton, 'minutes'),
      );

      const refreshToken = await this.signToken(
        user._id.toHexString(),
        //@ts-ignore
        this.momentWrapper().add(refreshDuration, 'days'),
      );

      return {
        accessToken,
        accessDuraton,
        refreshDuration,
        refreshToken,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  saveToken = async (
    token: string,
    userId: string,
    expires: moment.Moment | string,
    type: string,
    blacklisted = false,
  ) => {
    return this.TokenSchema.create({
      token,
      userId,
      type,
      expires,
      blacklisted,
    });
  };

  verifyToken = async (token: string) => {
    try {
      const secret = this.config.get('JWT_AUTH_SECRET');
      const payload = await this.jwt.verifyAsync(token, secret);
      const tokenDoc: IPayload | null = await this.TokenSchema.findOne({
        token,
        type: 'refresh',
        userId: payload.sub,
        blacklisted: false,
      });

      if (!tokenDoc)
        throw new AppException({
          status: HttpStatus.NOT_FOUND,
          error: 'token not found',
        });
      return { tokenDoc, token };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  };

  findOneToken = async (token: string) => {
    return this.TokenSchema.findOne({ token });
  };
  deleteOneToken = async (token: string) => {
    return this.TokenSchema.deleteOne({ token });
  };
}

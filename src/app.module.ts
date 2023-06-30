import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { HistoryModule } from './history/history.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { User, UserSchema } from './user/schema';
import { Token, TokenSchema } from './auth/schema';
import { Vehicle, VehicleSchema } from './vehicle/schema';
import { History, HistorySchema } from './history/schema';
import { APP_FILTER } from '@nestjs/core';
import { AppErrorResponseFilter } from './exception';
import { MailModule } from './mail/mail.module';
import { RedisConfigModule } from './redis/redis.module';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      connectionFactory: (connection: Connection) => {
        return connection;
      },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
      { name: Vehicle.name, schema: VehicleSchema },
      { name: History.name, schema: HistorySchema },
    ]),
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          url: process.env.REDIS_URL || 'redis://localhost:6379',
        },
      }),
    }),
    VehicleModule,
    HistoryModule,
    AuthModule,
    UserModule,
    MailModule,
    RedisConfigModule,
  ],
  // controllers: [AppController],
  providers: [{ provide: APP_FILTER, useClass: AppErrorResponseFilter }],
})
export class AppModule {}

import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { AuthModule } from './features';
import { UserModule } from './features';
import { VehicleModule } from './features';
import { HistoryModule } from './features';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { User, UserSchema } from './features';
import { Token, TokenSchema } from './features';
import { Vehicle, VehicleSchema } from './features';
import { History, HistorySchema } from './features';
import { APP_FILTER } from '@nestjs/core';
import { AppErrorResponseFilter } from './core';
import { MailModule } from './shared';
import { RedisConfigModule } from './core';
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

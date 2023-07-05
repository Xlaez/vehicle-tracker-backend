import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  providers: [MailService],
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: `smtp://${process.env.SMTP_USER}:${process.env.SMTP_PASS}@smtp.gmail.com`,
        defaults: {
          from: '"vehicle tracker" <noreply@test.com>',
        },
      }),
    }),
  ],
})
export class MailModule {}

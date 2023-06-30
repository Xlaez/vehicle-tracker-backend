import { MailerService } from '@nestjs-modules/mailer';
import { HttpStatus, Injectable } from '@nestjs/common';
import { MailConstant } from 'src/constants';
import { AppException } from 'src/exception';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  sendMail = async (
    to: string,
    subject: string,
    username: string,
    code: string,
  ) => {
    let html: string;
    switch (subject) {
      case 'Verify Your Account':
        html = MailConstant.register(username, code);
        break;
      case 'Your Password Reset Code':
        html = MailConstant.passwordReset(username, code);
        break;
      default:
        break;
    }

    try {
      this.mailService
        .sendMail({ to, subject, html })
        .then((result) => {
          return result;
        })
        .catch((e) => {
          throw new AppException({
            error: e,
            status: HttpStatus.EXPECTATION_FAILED,
          });
        });
    } catch (e) {
      throw new AppException({
        error: e,
        status: HttpStatus.EXPECTATION_FAILED,
      });
    }
  };
}

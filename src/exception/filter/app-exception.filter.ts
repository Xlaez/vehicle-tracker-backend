import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { AppException } from '../exception/app.exception';

@Catch(AppException)
export class AppErrorResponseFilter extends BaseExceptionFilter {
  catch(exception: AppException, host: ArgumentsHost): void {
    const message = exception.message;
    super.catch(new HttpException(message, exception.code), host);
  }
}

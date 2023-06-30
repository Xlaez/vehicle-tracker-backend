import { HttpStatus } from '@nestjs/common';
import { IError } from 'src/interface';

export class AppException extends Error {
  public code: number;

  constructor(error: IError) {
    super(error.error);
    this.name = 'Error: ';
    this.code = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

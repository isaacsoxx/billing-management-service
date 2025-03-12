import { HttpStatus } from '@nestjs/common';
import { Expose } from 'class-transformer';

export class ApiResponseDto<T> {
  @Expose()
  statusCode: number = HttpStatus.OK;

  @Expose()
  message?: string;

  @Expose()
  isSuccess?: boolean = true;

  @Expose()
  data?: T;

  constructor(
    statusCode: number,
    message?: string,
    data?: T,
    isSuccess?: boolean,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.isSuccess = isSuccess;
  }
}

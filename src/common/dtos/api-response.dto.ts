import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ApiResponseDto<T> {
  @ApiProperty()
  @Expose()
  statusCode: number = HttpStatus.OK;

  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty()
  @Expose()
  isSuccess?: boolean;

  @ApiProperty()
  @Expose()
  data?: T;

  constructor(
    statusCode: number,
    message: string,
    data?: T,
    isSuccess?: boolean,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.isSuccess = isSuccess;
  }

  static createError(statusCode: number, message: string) {
    return new ApiResponseDto(statusCode, message, null, false);
  }

  static createSuccess<T>(statusCode: number, message: string, data?: T) {
    return new ApiResponseDto(statusCode, message, data, true);
  }
}

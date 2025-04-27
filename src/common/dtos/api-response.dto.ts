import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { getMessage, MessageType } from '..';

export class ApiResponseDto<T> {
  @ApiProperty({
    example: getMessage(MessageType.swagger, 'dtos.apiResponse.statusCode'),
  })
  @Expose()
  statusCode: number = HttpStatus.OK;

  @ApiProperty({
    example: getMessage(MessageType.swagger, 'dtos.apiResponse.message'),
  })
  @Expose()
  message: string;

  @ApiProperty({
    example: getMessage(MessageType.swagger, 'dtos.apiResponse.isSuccess'),
  })
  @Expose()
  isSuccess?: boolean;

  @ApiProperty({
    example: getMessage(MessageType.swagger, 'dtos.apiResponse.data'),
  })
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

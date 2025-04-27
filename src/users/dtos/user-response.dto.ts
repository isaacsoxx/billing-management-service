import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { UserRoles } from '../../auth';
import { getMessage, MessageType } from '../../common';

export class UsersResponseDto {
  @ApiProperty({
    example: getMessage(MessageType.swagger, 'dtos.userResponse.uuid'),
  })
  @Expose()
  uuid: string;

  @ApiProperty({
    example: getMessage(MessageType.swagger, 'dtos.userResponse.firstName'),
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    example: getMessage(MessageType.swagger, 'dtos.userResponse.lastName'),
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    example: getMessage(MessageType.swagger, 'dtos.userResponse.phoneNumber'),
  })
  @Expose()
  phoneNumber: string;

  @ApiProperty({
    example: getMessage(MessageType.swagger, 'dtos.userResponse.isActive'),
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    example: getMessage(MessageType.swagger, 'dtos.userResponse.role'),
  })
  @Expose()
  role: UserRoles;

  @ApiProperty({
    example: getMessage(MessageType.swagger, 'dtos.userResponse.sponsor'),
  })
  @Expose()
  @Transform(({ value }) => value ?? undefined)
  sponsor?: string;
}

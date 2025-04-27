import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRoles } from '../../auth';
import { getMessage, MessageType } from '../../common';

export class UserRequestDto {
  @ApiProperty({
    example: getMessage(MessageType.swagger, 'users.dtos.firstName.example'),
    description: getMessage(
      MessageType.swagger,
      'users.dtos.firstName.description',
    ),
  })
  @IsString()
  firstName: string;

  @ApiPropertyOptional({
    example: getMessage(MessageType.swagger, 'users.dtos.lastName.example'),
    description: getMessage(
      MessageType.swagger,
      'users.dtos.lastName.description',
    ),
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    example: getMessage(MessageType.swagger, 'users.dtos.phoneNumber.example'),
    description: getMessage(
      MessageType.swagger,
      'users.dtos.phoneNumber.description',
    ),
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: getMessage(MessageType.swagger, 'users.dtos.isActive.example'),
    description: getMessage(
      MessageType.swagger,
      'users.dtos.isActive.description',
    ),
  })
  @IsBoolean()
  isActive: boolean = true;

  @ApiProperty({
    example: getMessage(MessageType.swagger, 'users.dtos.role.example'),
    enum: UserRoles,
    enumName: 'UserRoles',
    description: getMessage(MessageType.swagger, 'users.dtos.role.description'),
  })
  @IsEnum(UserRoles, {
    message: getMessage(MessageType.swagger, 'users.dtos.role.message'),
  })
  @IsNotEmpty({ message: 'Role is required.' })
  role: UserRoles;
}

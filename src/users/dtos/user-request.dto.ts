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
    example: getMessage(
      MessageType.swagger,
      'dtos.userRequest.firstName.example',
    ),
    description: getMessage(
      MessageType.swagger,
      'dtos.userRequest.firstName.description',
    ),
  })
  @IsString()
  firstName: string;

  @ApiPropertyOptional({
    example: getMessage(
      MessageType.swagger,
      'dtos.userRequest.lastName.example',
    ),
    description: getMessage(
      MessageType.swagger,
      'dtos.userRequest.lastName.description',
    ),
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    example: getMessage(
      MessageType.swagger,
      'dtos.userRequest.phoneNumber.example',
    ),
    description: getMessage(
      MessageType.swagger,
      'dtos.userRequest.phoneNumber.description',
    ),
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: getMessage(
      MessageType.swagger,
      'dtos.userRequest.isActive.example',
    ),
    description: getMessage(
      MessageType.swagger,
      'dtos.userRequest.isActive.description',
    ),
  })
  @IsBoolean()
  isActive: boolean = true;

  @ApiProperty({
    example: getMessage(MessageType.swagger, 'dtos.userRequest.role.example'),
    enum: UserRoles,
    enumName: 'UserRoles',
    description: getMessage(
      MessageType.swagger,
      'dtos.userRequest.role.description',
    ),
  })
  @IsEnum(UserRoles, {
    message: getMessage(MessageType.swagger, 'dtos.userRequest.role.message'),
  })
  @IsNotEmpty({ message: 'Role is required.' })
  role: UserRoles;
}

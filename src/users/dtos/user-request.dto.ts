import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRoles } from 'src/auth';

export class UserRequestDto {
  @ApiProperty({ example: 'John', description: 'Required user first name.' })
  @IsString()
  firstName: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Optional user last name.',
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    example: 'true | false',
    description: 'If the user will be deactivated or activated by default.',
  })
  @IsBoolean()
  isActive: boolean = true;

  @ApiProperty({
    example: 'maintainer | admin | staff',
    enum: UserRoles,
    enumName: 'UserRoles',
    description: 'Role for the user.',
  })
  @IsEnum(UserRoles, {
    message: 'Role must be either: maintainer, admin or staff.',
  })
  @IsNotEmpty({ message: 'Role is required.' })
  role: UserRoles;
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { UserRoles } from 'src/auth';

export class UsersResponseDto {
  @ApiProperty()
  @Expose()
  uuid: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  role: UserRoles;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? undefined)
  sponsor?: string;
}

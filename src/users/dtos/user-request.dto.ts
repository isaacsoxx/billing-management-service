import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UserRequestDto {
  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsBoolean()
  isActive: boolean = true;
}

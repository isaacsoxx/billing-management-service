import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserRequestDto {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsNotEmpty()
  @IsDefined()
  phoneNumber: string;

  @IsBoolean()
  isActive: boolean = true;
}

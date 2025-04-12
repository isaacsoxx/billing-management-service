import { IsDefined, IsNotEmpty } from 'class-validator';

export class AuthLoginUserRequestDto {
  @IsNotEmpty()
  @IsDefined()
  phoneNumber: string;

  @IsNotEmpty()
  @IsDefined()
  firstName: string;

  @IsNotEmpty()
  @IsDefined()
  password: string;
}

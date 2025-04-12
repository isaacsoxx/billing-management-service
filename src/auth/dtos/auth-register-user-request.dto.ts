import { IsDefined, IsNotEmpty } from 'class-validator';

export class AuthRegisterUserRequestDto {
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

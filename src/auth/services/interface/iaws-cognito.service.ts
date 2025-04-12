import {
  AuthLoginUserRequestDto,
  AuthRegisterUserRequestDto,
} from 'src/auth/dtos';

export interface iAwsCognitoService {
  registerUser(authRegisterUserRequestDto: AuthRegisterUserRequestDto);
  authenticateUser(authLoginUserRequestDto: AuthLoginUserRequestDto);
}

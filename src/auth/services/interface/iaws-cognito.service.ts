import { AuthAttributesDto } from '../..';
import { Users } from '../../../users';

export interface iAwsCognitoService {
  registerUser(userResource: Users): Promise<void>;
  getAuthAttributes(accessToken: string): Promise<AuthAttributesDto>;
}

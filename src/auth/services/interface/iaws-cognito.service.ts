import { AuthAttributesDto } from '../..';
import { Users } from '../../../users';

export interface iAwsCognitoService {
  registerUser(userResource: Users): Promise<void>;
  // getUserDetails(accessToken: string): Promise<AuthAttributesDto>;
}

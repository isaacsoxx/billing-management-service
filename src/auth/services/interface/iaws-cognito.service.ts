import { TrustDeviceRequestDto } from 'src/auth/dtos/trust-device-request.dto';
import { AuthAttributesDto } from '../..';
import { Users } from '../../../users';

export interface iAwsCognitoService {
  registerUser(userResource: Users): Promise<void>;
  getAuthAttributes(accessToken: string): Promise<AuthAttributesDto>;

  // ToDo: Setup method signature
  registerTrustedDevice(
    trustDevice: TrustDeviceRequestDto,
    token: string,
  ): Promise<any>;
  getUserTrustedDevices(userSub: string): any;
}

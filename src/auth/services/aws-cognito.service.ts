import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { iAwsCognitoService } from '.';
import { Users } from '../../users';
import { AuthAttributesDto, UserRoles } from '..';

@Injectable()
export class AwsCognitoService implements iAwsCognitoService {
  private cognito: CognitoIdentityProviderClient;
  private userPoolId: string;
  private accessKey: string;
  private secretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.userPoolId = this.configService.get<string>('aws_pool_id')!;
    this.accessKey = this.configService.get<string>('aws_access_key')!;
    this.secretKey = this.configService.get<string>('aws_secret_key')!;
    this.cognito = new CognitoIdentityProviderClient({
      region: this.configService.get<string>('aws_region'),
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
    });
  }

  async registerUser(userResource: Users): Promise<void> {
    try {
      const username = userResource.phoneNumber,
        tempPass = `${userResource.firstName}@${userResource.phoneNumber.slice(userResource.phoneNumber.length - 4)}`,
        role = userResource.role,
        uuid = userResource.uuid;

      await this.createUserInPool(username, tempPass, role, uuid);
      await this.setPasswordPolicy(username, tempPass);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating user in pool.',
        error,
      );
    }
  }

  // async getUserDetails(accessToken: string): Promise<AuthAttributesDto> {}

  private async createUserInPool(
    username: string,
    tempPass: string,
    role: UserRoles,
    uuid: string,
  ) {
    const createUserRequest = new AdminCreateUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      TemporaryPassword: tempPass,
      UserAttributes: [
        {
          Name: 'phone_number',
          Value: username,
        },
        {
          Name: 'phone_number_verified',
          Value: 'true',
        },
        {
          Name: 'custom:role',
          Value: role,
        },
        {
          Name: 'custom:uuid',
          Value: uuid,
        },
      ],
      MessageAction: 'SUPPRESS',
    });

    await this.cognito.send(createUserRequest);
    // .then(() => {
    //   return this.setPasswordPolicy(username, tempPass);
    // })
    // .catch((error) => {
    //   console.info('Error creating user in pool');
    //   console.error('Error details:', JSON.stringify(error, null, 2));
    //   throw new ConflictException();
    // });
  }

  private async setPasswordPolicy(username: string, tempPass: string) {
    const passwordPolicyRequest = new AdminSetUserPasswordCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      Password: tempPass,
      Permanent: false,
    });

    await this.cognito.send(passwordPolicyRequest);
    // .then(() => {
    //   return true;
    // })
    // .catch((error) => {
    //   console.error('Error setting password policy', error);
    //   throw new ConflictException();
    // });
  }
}

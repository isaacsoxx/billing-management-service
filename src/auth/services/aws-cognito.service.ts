import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { iAwsCognitoService } from '.';
import { AuthAttributesDto, UserRoles } from '..';
import { Users } from '../../users';
import { getMessage, MessageType } from 'src/common';

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
      throw error;
    }
  }

  async getAuthAttributes(sub: string): Promise<AuthAttributesDto> {
    const params = {
      UserPoolId: this.userPoolId,
      Filter: `sub="${sub}"`,
      Limit: 1,
    };

    const command = new ListUsersCommand(params),
      response = await this.cognito.send(command),
      user = response.Users?.[0];
    let role, uuid;

    if (!user) {
      throw new NotFoundException(
        getMessage(MessageType.app, 'aws.errors.notFound'),
      );
    }

    user.Attributes?.forEach((attr) => {
      if (attr.Name === 'custom:role') role = attr.Value;
      if (attr.Name === 'custom:uuid') uuid = attr.Value;
    });

    if (!Object.values(UserRoles).includes(role)) {
      throw new ConflictException(
        getMessage(MessageType.app, 'aws.errors.conflict', { role }),
      );
    }

    return {
      role: role as UserRoles,
      uuid: uuid,
    };
  }

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
  }

  private async setPasswordPolicy(username: string, tempPass: string) {
    const passwordPolicyRequest = new AdminSetUserPasswordCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      Password: tempPass,
      Permanent: false,
    });

    await this.cognito.send(passwordPolicyRequest);
  }
}

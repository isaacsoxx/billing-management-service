import {
  AdminCreateUserCommand,
  AdminListDevicesCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  UpdateDeviceStatusCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { iAwsCognitoService } from '.';
import { AuthAttributesDto, UserRoles, TrustDeviceRequestDto } from '..';
import { Users } from '../../users';
import { getMessage, MessageType } from '../../common';

@Injectable()
export class AwsCognitoService implements iAwsCognitoService {
  private cognitoApiClient: CognitoIdentityProviderClient;
  private cognitoUiClient: CognitoIdentityProviderClient;
  private poolId: string;
  private adminAccessKey: string;
  private adminSecretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.poolId = this.configService.get<string>('aws_pool_id')!;
    this.adminAccessKey = this.configService.get<string>(
      'aws_admin_access_key',
    )!;
    this.adminSecretKey = this.configService.get<string>(
      'aws_admin_secret_key',
    )!;

    this.cognitoApiClient = new CognitoIdentityProviderClient({
      region: this.configService.get<string>('aws_region'),
      credentials: {
        accessKeyId: this.adminAccessKey,
        secretAccessKey: this.adminSecretKey,
      },
    });
    this.cognitoUiClient = new CognitoIdentityProviderClient({
      region: this.configService.get<string>('aws_region'),
      credentials: {
        accessKeyId: this.adminAccessKey,
        secretAccessKey: this.adminSecretKey,
      },
    });
  }

  async registerUser(userResource: Users): Promise<void> {
    try {
      const username = userResource.emailAddress,
        tempPass = `${userResource.firstName.toUpperCase().substring(1)}${userResource.lastName}@123`,
        role = userResource.role,
        uuid = userResource.uuid;

      await this.createUserInPool(username, tempPass, role, uuid);
      await this.setTemporalPassword(username, tempPass);
    } catch (error) {
      throw error;
    }
  }

  async getAuthAttributes(sub: string): Promise<AuthAttributesDto> {
    const params = {
      UserPoolId: this.poolId,
      Filter: `sub="${sub}"`,
      Limit: 1,
    };

    const listUsersCommand = new ListUsersCommand(params),
      response = await this.cognitoUiClient.send(listUsersCommand),
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

  async registerTrustedDevice(
    trustDeviceRequest: TrustDeviceRequestDto,
    token: string,
  ): Promise<any> {
    try {
      const updateDeviceTrustCommand = new UpdateDeviceStatusCommand({
        AccessToken: token,
        DeviceKey: trustDeviceRequest.deviceKey,
        DeviceRememberedStatus: 'remembered',
      });

      return this.cognitoApiClient.send(updateDeviceTrustCommand);
    } catch (error) {
      throw error;
    }
  }

  async getUserTrustedDevices(userSub: string) {
    const listUserDevicesCommand = new AdminListDevicesCommand({
      UserPoolId: this.poolId,
      Username: userSub,
    });

    return await this.cognitoApiClient.send(listUserDevicesCommand);
  }

  private async createUserInPool(
    username: string,
    tempPass: string,
    role: UserRoles,
    uuid: string,
  ) {
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: this.poolId,
      Username: username,
      TemporaryPassword: tempPass,
      UserAttributes: [
        {
          Name: 'email',
          Value: username,
        },
        {
          Name: 'email_verified',
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

    await this.cognitoApiClient.send(createUserCommand);
  }

  private async setTemporalPassword(username: string, tempPass: string) {
    const createPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: this.poolId,
      Username: username,
      Password: tempPass,
      Permanent: false,
    });

    await this.cognitoApiClient.send(createPasswordCommand);
  }
}

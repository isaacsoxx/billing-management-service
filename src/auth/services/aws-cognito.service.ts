import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  ISignUpResult,
} from 'amazon-cognito-identity-js';
import { AuthLoginUserRequestDto, AuthRegisterUserRequestDto } from '../dtos';
import { iAwsCognitoService } from '.';
import { createHmac, hash } from 'crypto';

@Injectable()
export class AwsCognitoService implements iAwsCognitoService {
  private userPool: CognitoUserPool;
  private userPoolId: string;
  private clientId: string;
  private clientSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.userPoolId = this.configService.get<string>('aws_pool_id')!;
    this.clientId = this.configService.get<string>('aws_client_id')!;
    this.clientSecret = this.configService.get<string>('aws_client_secret')!;

    this.userPool = new CognitoUserPool({
      UserPoolId: this.userPoolId,
      ClientId: this.clientId,
    });
  }

  async registerUser(authRegisterUserRequestDto: AuthRegisterUserRequestDto) {
    const customAttributes = [
        new CognitoUserAttribute({
          Name: 'username',
          Value: authRegisterUserRequestDto.firstName,
        }),
      ],
      clientSecret = this.getClientSecret(
        authRegisterUserRequestDto.phoneNumber,
      );

    return await this.userPool.signUp(
      authRegisterUserRequestDto.phoneNumber,
      authRegisterUserRequestDto.password,
      customAttributes,
      [],
      (error, result) => this.signUpResult(error, result),
    );
  }

  async authenticateUser(authLoginUserRequestDto: AuthLoginUserRequestDto) {
    const userData = {
        Username: authLoginUserRequestDto.phoneNumber,
        Pool: this.userPool,
      },
      authenticationDetails = new AuthenticationDetails({
        Username: authLoginUserRequestDto.phoneNumber,
        Password: authLoginUserRequestDto.password,
      }),
      userCognito = new CognitoUser(userData);

    return await userCognito.authenticateUser(authenticationDetails, {
      onSuccess: (result: CognitoUserSession) => this.onSuccessLogin(result),
      onFailure: (error): any => this.onFailedLogin(error),
    });
  }

  private getClientSecret(username: string) {
    const hasher = createHmac('sha256', this.clientSecret).update(
        `${username}${this.clientId}`,
      ),
      secretHash = hasher.digest('base64');

    return secretHash;
  }

  private signUpResult(
    err: Error | undefined,
    result: ISignUpResult | undefined,
  ) {
    return new Promise((resolve, reject) => {
      console.log(err, result);
      if (!result) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }

  private onSuccessLogin(result: CognitoUserSession) {
    return {
      accessToken: result.getAccessToken().getJwtToken(),
      refreshToken: result.getRefreshToken().getToken(),
    };
  }

  private onFailedLogin(err) {
    return err;
  }
}

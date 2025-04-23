import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { iJwtVerificationService } from '.';

@Injectable()
export class JwtVerificationService implements iJwtVerificationService {
  private verifier;

  constructor(private readonly configService: ConfigService) {
    this.verifier = CognitoJwtVerifier.create({
      userPoolId: this.configService.get<string>('aws_pool_id')!,
      tokenUse: 'access',
      clientId: this.configService.get<string>('aws_client_id')!,
    });
  }

  async verifyToken(token: string): Promise<Record<string, any>> {
    try {
      const payload = await this.verifier.verify(token);
      console.log('verified', token);
      return payload;
    } catch (err) {
      throw new UnauthorizedException(
        'Provided token might be expired or invalid.',
      );
    }
  }
}

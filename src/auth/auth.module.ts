import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '../config/config';
import { AwsCognitoService, JwtVerificationService } from './services';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: 'iAwsCognitoService',
      useClass: AwsCognitoService,
    },
    {
      provide: 'iJwtVerificationService',
      useClass: JwtVerificationService,
    },
  ],
  exports: [
    {
      provide: 'iAwsCognitoService',
      useClass: AwsCognitoService,
    },
    {
      provide: 'iJwtVerificationService',
      useClass: JwtVerificationService,
    },
  ],
})
export class AuthModule {}

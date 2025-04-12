import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '../config/config';
import { AwsCognitoService } from './services';

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
  ],
  exports: [
    {
      provide: 'iAwsCognitoService',
      useClass: AwsCognitoService,
    },
  ],
})
export class AuthModule {}

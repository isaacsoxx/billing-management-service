import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import config from './config';
import * as path from 'path';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(
        __dirname,
        `../../.env.${process.env.NODE_ENV || 'development'}`,
      ),
      load: [config],
      // validationSchema TODO
    }),
  ],
})
export class ConfigModule {}

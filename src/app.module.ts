import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users';
import { BillingModule } from './billing/billing.module';
import { DatabaseModule } from './database';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    BillingModule,
    DatabaseModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}

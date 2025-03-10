import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users';
import { BillingModule } from './billing/billing.module';
import { DatabaseModule } from './database';

@Module({
  imports: [UsersModule, BillingModule, DatabaseModule, ConfigModule],
})
export class AppModule {}

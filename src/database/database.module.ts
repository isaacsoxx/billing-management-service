import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Users } from '../users/entities';
import { ConfigModule } from '../config';

// Leaving synchronize as true is only recommended when no production databases are used, and migrations are not used
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get<string>('database'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        synchronize: true,
        entities: [Users],
      }),
    }),
  ],
})
export class DatabaseModule {}

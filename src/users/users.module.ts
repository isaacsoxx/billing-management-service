import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController, AuthController } from './controllers';
import { UsersService } from './services';
import { Users } from './entities';
import { UsersRepository } from './repository';
import { AuthModule } from '../auth';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), AuthModule],
  controllers: [UsersController, AuthController],
  providers: [
    {
      provide: 'iUsersService',
      useClass: UsersService,
    },
    {
      provide: 'iUsersRepository',
      useClass: UsersRepository,
    },
  ],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers';
import { UsersService } from './services';
import { Users } from './entities';
import { UsersRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
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

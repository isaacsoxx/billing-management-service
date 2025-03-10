import { Injectable } from '@nestjs/common';
import { iUsersService } from './interface';
import { UserRequestDto } from '../dtos';
import { Repository } from 'typeorm';
import { Users } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService implements iUsersService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>
    ) { }
    
    async createUser(userToCreate: UserRequestDto) {
        const newUser = this.usersRepository.create(userToCreate);
        return await this.usersRepository.save(newUser);
    }

    async updateUserById(id: string, userToUpdate: UserRequestDto) {
        await this.usersRepository.update(
            { _id: new ObjectId(id) },
            userToUpdate
        );
    }

    async findAllUsers() {
        return await this.usersRepository.find();
    }

    async findOneUserById(id: string) {
        return await this.usersRepository.findOneBy(
            { _id: new ObjectId(id) }
        );
    }
}

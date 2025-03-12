import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities';
import { Repository, UpdateResult } from 'typeorm';
import { iUsersRepository } from './interface/iusers.repository';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersRepository implements iUsersRepository {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async createUser(userToCreate: Users): Promise<Users> {
    const newUser = this.usersRepository.create(userToCreate);
    return await this.usersRepository.save(newUser);
  }

  async updateUserById(userToUpdate: Users): Promise<UpdateResult> {
    const result = await this.usersRepository.update(
      { _id: new ObjectId(userToUpdate._id) },
      userToUpdate,
    );

    return result;
  }

  async findAllUsers(): Promise<Users[]> {
    return await this.usersRepository.find();
  }

  async findOneUserById(uuid: string): Promise<Users | null> {
    return await this.usersRepository.findOneBy({ uuid });
  }
}

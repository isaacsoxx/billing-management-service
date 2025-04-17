import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { Repository, UpdateResult } from 'typeorm';
import { UserRoles } from '../../auth';
import { Users } from '../entities';
import { iUsersRepository } from '../';

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
  async findAllByRole(role: UserRoles): Promise<Users[]> {
    return await this.usersRepository.find({
      where: { role },
    });
  }

  async findOneUserById(uuid: string): Promise<Users | null> {
    return await this.usersRepository.findOneBy({ uuid });
  }

  async findAllSubscriptionsById(sponsorId: string): Promise<Users[]> {
    return await this.usersRepository.find({
      where: { sponsor: sponsorId },
    });
  }
}

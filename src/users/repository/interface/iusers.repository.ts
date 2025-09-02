import { UpdateResult } from 'typeorm';
import { Users } from '../..';

export interface iUsersRepository {
  createUser(userToCreate: Users): Promise<Users>;
  updateUserById(userToUpdate: Users): Promise<UpdateResult>;
  findOneUserById(uuid: string): Promise<Users | null>;
  findAll(): Promise<Users[]>;

  findAllSubscriptionsById(sponsorId: string): Promise<Users[]>;
}

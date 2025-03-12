import { Users } from 'src/users/entities';
import { UpdateResult } from 'typeorm';

export interface iUsersRepository {
  createUser(userToCreate: Users): Promise<Users>;
  updateUserById(userToUpdate: Users): Promise<UpdateResult>;
  findAllUsers(): Promise<Users[]>;
  findOneUserById(uuid: string): Promise<Users | null>;
}

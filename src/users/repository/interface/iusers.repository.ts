import { UpdateResult } from 'typeorm';
import { UserRoles } from '../../../auth';
import { Users } from '../..';

export interface iUsersRepository {
  createUser(userToCreate: Users): Promise<Users>;
  updateUserById(userToUpdate: Users): Promise<UpdateResult>;
  findOneUserById(uuid: string): Promise<Users | null>;
  findAllByRole(role: UserRoles): Promise<Users[]>;

  findAllSubscriptionsById(sponsorId: string): Promise<Users[]>;
}

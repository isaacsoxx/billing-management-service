import {
  Column,
  Entity,
  ObjectId,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserRequestDto } from '../dtos';
import { UserRoles } from '../../auth';

@Entity()
@Unique('UUID_UNIQUE', ['uuid'])
@Unique('PHONE_NUMBER_UNIQUE', ['phoneNumber'])
export class Users {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'string', nullable: false })
  firstName: string;

  @Column({ type: 'string', nullable: true })
  lastName?: string;

  @Column({ type: 'string', nullable: false })
  phoneNumber: string;

  @Column({ type: 'string', nullable: true })
  sponsor?: string;

  @Column({ type: 'enum', enum: UserRoles })
  role: UserRoles;

  @Column()
  isActive: boolean;

  constructor(userDto?: UserRequestDto) {
    Object.assign(this, userDto);
  }
}

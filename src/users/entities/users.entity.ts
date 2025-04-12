import {
  Column,
  Entity,
  ObjectId,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserRequestDto } from '../dtos';

@Entity()
@Unique('UUID_UNIQUE', ['uuid'])
@Unique('PHONE_NUMBER_UNIQUE', ['phoneNumber'])
export class Users {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('phoneNumber')
  phoneNumber: string;

  @Column()
  isActive: boolean;

  constructor(userDto?: UserRequestDto) {
    Object.assign(this, userDto);
  }
}

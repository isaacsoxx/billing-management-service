import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class Users {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    isActive: boolean;
}
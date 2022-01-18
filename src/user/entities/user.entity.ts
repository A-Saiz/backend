import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userID: number;

    @Column()
    email: string;

    @Column()
    username: string;

    //TODO: Use bcrypt to hash password
    @Column()
    password: string;
}

import { Exclude, Expose } from "class-transformer";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userID: number;

    @Column({unique: true})
    @Expose()
    email: string;

    @Column({nullable: true})
    @Exclude()
    currentRefreshToken?: string;

    @Column()
    @Expose()
    username: string;

    @Column()
    @Exclude()
    password: string;
}

export default User;

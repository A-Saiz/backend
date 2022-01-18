import { Connection } from "typeorm";
import { User } from "../user/entities/user.entity";

//NEED TO CHANGE MAGIC STRINGS TO CONFIG AND ENV FILE
export const userProvider = [{
    provide: 'USER_REPO',
    useFactory: (connection: Connection) => connection.getRepository(User),
    inject: ['DATABASE_CONNECTION'],
}]
import { ConfigService } from "@nestjs/config";
import { Image } from "src/image/entities/image.entity";
import { User } from "src/user/entities/user.entity";
import { createConnection } from "typeorm";

//NEED TO CHANGE MAGIC STRINGS TO CONFIG AND ENV FILE
export const databaseProvider = [
    {
        provide: 'DATABASE_CONNECTION',
        inject: [ConfigService],
        useFactory: async () => await createConnection({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'asaiz',
            password: 'Ilovemy2kids&grandson!',
            database: 'pristine_finishes',
            entities: [Image, User],
            synchronize: true, 
        })
    }
]
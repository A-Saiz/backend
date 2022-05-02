import { Image } from "src/image/entities/image.entity";
import { User } from "src/user/entities/user.entity";
import { DataSource } from "typeorm";

//NEED TO CHANGE MAGIC STRINGS TO CONFIG AND ENV FILE
export const MysqlDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'asaiz',
    password: 'Ilovemy2kids&grandson!',
    database: 'pristine_finishes',
    entities: [Image, User],
    synchronize: true,
})

MysqlDataSource.initialize()
.then(() => {
    console.log("Data Source has been initialized")
})
.catch((err) => {
    console.error("Error during Data Source initialization", err)
})
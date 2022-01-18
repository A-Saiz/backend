import { Connection } from "typeorm";
import { Image } from "../image/entities/image.entity";

//NEED TO CHANGE MAGIC STRINGS TO CONFIG AND ENV FILE
export const imageProvider = [{
    provide: 'IMAGE_REPO',
    useFactory: (connection: Connection) => connection.getRepository(Image),
    inject: ['DATABASE_CONNECTION'],
}]
import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { imageProvider } from "../providers/image.provider";
import { DatabaseModule } from 'src/modules/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ImageController],
  providers: [
    ...imageProvider,
    ImageService
  ]
})
export class ImageModule {}

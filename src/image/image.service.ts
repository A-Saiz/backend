import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

import { Image } from "../image/entities/image.entity";
import { MysqlDataSource } from 'src/providers/database.provider';

const ImageRepository = MysqlDataSource.getRepository(Image);

@Injectable()
export class ImageService {
  constructor() {}
  
   async create(createImageDto: CreateImageDto): Promise<Image> {
    const newFile = ImageRepository.create(createImageDto);
    return await ImageRepository.save(newFile);
  }

  async findAll(): Promise<Image[]> {
    return await ImageRepository.find();
  }

  async findByImagePath(path: string): Promise<Image> {
    return await ImageRepository.findOneBy({imagePath: path});
  }

  async findOne(id: number): Promise<Image[]> {
    return await ImageRepository.find({where: {id: id}});
  }

  async findImageByType(type: string): Promise<Image[]> {
    return await ImageRepository.find({where: {imageType: type}});
  }

  async update(id: number, updateImageDto: UpdateImageDto): Promise<Image> {
    const image = await ImageRepository.preload({
      id: id,
      ...updateImageDto,
    });
    if (!image) {
      throw new NotFoundException(`Item ${id} not found`);
    }
    return ImageRepository.save(image);
  }

  async remove(id: number) {
    const image = await this.findOne(id);
    return ImageRepository.remove(image);
  }
}

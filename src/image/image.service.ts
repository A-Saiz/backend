import { Inject, Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

import { Repository } from "typeorm";
import { Image } from "../image/entities/image.entity";

@Injectable()
export class ImageService {
  constructor(
    @Inject('IMAGE_REPO')
    private imageRepo: Repository<Image>
  ) {}
  
   async create(createImageDto: CreateImageDto) {
    const newFile = this.imageRepo.create(createImageDto);
    await this.imageRepo.save(newFile);
    return newFile;
  }

  async findAll(): Promise<Image[]> {
    return this.imageRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}

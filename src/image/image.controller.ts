import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, Res, UseGuards, ConflictException } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/middleware/file-upload.utils';
import JwtAuthGaurd from 'src/guards/jwtAuth.gaurd';
import { Image } from './entities/image.entity';

@Controller('image')
export class ImageController {
  private path = '/files/';
  constructor(private readonly imageService: ImageService) {}

  /**
   * Uploads a single file
   * @param file File to upload
   * @returns Uploaded file
   */
  @Post('upload')
  //@UseGuards(JwtAuthGaurd)
  @UseInterceptors(
    FileInterceptor('imagePath', {
      storage: diskStorage({
        destination: './files/',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file: Express.Multer.File, @Body() createImageDto: CreateImageDto): Promise<Image> {

    let body: CreateImageDto = {
      imagePath: this.path + file.filename,
      description: createImageDto.description,
      imageType: createImageDto.imageType,
      completed: createImageDto.completed
    }

    const existing = await this.imageService.findAll();
    existing.forEach(image => {
      if (image.imagePath == body.imagePath) {
        throw new ConflictException(`Image ${image.imagePath} already exists.`);
      }
      return
    });
    return this.imageService.create(body);
  }

  /**
   * Uploads multiple files
   * @param files Files to upload
   * @returns Uploaded files
   */
  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files): Promise<any[]> {
    const response = [];
    files.forEach((file: { filename: any; }) => {
      const fileReponse = {
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    return response;
  }

  /**
   * Gets an image from image path
   * @param image Image to return
   * @param res Response
   * @returns 
   */
  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image: string, @Res() res) {
    return res.sendFile(image, { root: './files' });
}

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.imageService.findOne(id);
  }

  @Get('imageType')
  findByImageType(@Param('imageType') type: string) {
    return this.imageService.findImageByType(type);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imageService.update(+id, updateImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.imageService.remove(id);
  }
}

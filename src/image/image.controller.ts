import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, Res, UseGuards } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/middleware/file-upload.utils';
import JwtAuthGaurd from 'src/guards/jwtAuth.gaurd';

@Controller('image')
export class ImageController {
  private path = '/files/';
  constructor(private readonly imageService: ImageService) {}

  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto);
  }

  /**
   * Uploads a single file
   * @param file File to upload
   * @returns Uploaded file
   */
  @Post('upload')
  @UseGuards(JwtAuthGaurd)
  @UseInterceptors(
    FileInterceptor('imagePath', {
      storage: diskStorage({
        destination: './files/',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file: Express.Multer.File) {
    const response = {
      filename: this.path + file.filename,
    };
    return response;
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
    files.forEach((file: { originalname: any; filename: any; }) => {
      const fileReponse = {
        originalname: file.originalname,
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
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './files' });
}

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imageService.update(+id, updateImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}

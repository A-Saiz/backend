import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateImageDto } from './create-image.dto';

export class UpdateImageDto extends PartialType(CreateImageDto) {
    @IsNumber()
    @IsOptional()
    id?: number;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    imagePath?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    imageType?: string;

    @IsDate()
    
    @IsNotEmpty()
    @IsOptional()
    completed?: Date;
}

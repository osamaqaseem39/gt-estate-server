import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGalleryDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  imageUrl: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;
}
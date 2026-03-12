import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;
}
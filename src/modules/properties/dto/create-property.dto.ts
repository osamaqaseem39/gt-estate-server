import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PropertyFeatureDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  value?: string;
}

export class PropertyImageDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  alt?: string;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}

export class CreatePropertyDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  bedrooms?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  bathrooms?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  area?: number;

  @ApiProperty({ required: false, default: 'available' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiProperty({ type: [PropertyFeatureDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyFeatureDto)
  @IsOptional()
  features?: PropertyFeatureDto[];

  @ApiProperty({ type: [PropertyImageDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyImageDto)
  @IsOptional()
  images?: PropertyImageDto[];
}
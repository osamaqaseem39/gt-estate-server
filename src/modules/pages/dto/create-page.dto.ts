import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePageDto {
  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
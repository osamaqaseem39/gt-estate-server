import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInquiryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;
}
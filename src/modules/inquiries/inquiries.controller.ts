import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inquiry' })
  @ApiResponse({ status: 201, description: 'Inquiry created successfully' })
  create(@Body() createInquiryDto: CreateInquiryDto) {
    return this.inquiriesService.create(createInquiryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all inquiries' })
  @ApiResponse({ status: 200, description: 'Inquiries retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query('status') status?: string) {
    return this.inquiriesService.findAll(status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inquiry by ID' })
  @ApiResponse({ status: 200, description: 'Inquiry retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Inquiry not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.inquiriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update inquiry' })
  @ApiResponse({ status: 200, description: 'Inquiry updated successfully' })
  @ApiResponse({ status: 404, description: 'Inquiry not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateInquiryDto: UpdateInquiryDto) {
    return this.inquiriesService.update(id, updateInquiryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete inquiry' })
  @ApiResponse({ status: 200, description: 'Inquiry deleted successfully' })
  @ApiResponse({ status: 404, description: 'Inquiry not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.inquiriesService.remove(id);
  }
}
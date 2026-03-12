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
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new gallery item' })
  @ApiResponse({ status: 201, description: 'Gallery item created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createGalleryDto: CreateGalleryDto) {
    return this.galleryService.create(createGalleryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all gallery items' })
  @ApiResponse({ status: 200, description: 'Gallery items retrieved successfully' })
  findAll(
    @Query('category') category?: string,
    @Query('featured') featured?: string,
  ) {
    const featuredFilter = featured === 'true' ? true : undefined;
    return this.galleryService.findAll(category, featuredFilter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get gallery item by ID' })
  @ApiResponse({ status: 200, description: 'Gallery item retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Gallery item not found' })
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update gallery item' })
  @ApiResponse({ status: 200, description: 'Gallery item updated successfully' })
  @ApiResponse({ status: 404, description: 'Gallery item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleryService.update(id, updateGalleryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete gallery item' })
  @ApiResponse({ status: 200, description: 'Gallery item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Gallery item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}
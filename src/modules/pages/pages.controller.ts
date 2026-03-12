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
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new page' })
  @ApiResponse({ status: 201, description: 'Page created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pages' })
  @ApiResponse({ status: 200, description: 'Pages retrieved successfully' })
  findAll(@Query('published') published?: string) {
    const publishedFilter = published === 'true' ? true : undefined;
    return this.pagesService.findAll(publishedFilter);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get page by slug' })
  @ApiResponse({ status: 200, description: 'Page retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.pagesService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get page by ID' })
  @ApiResponse({ status: 200, description: 'Page retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  findOne(@Param('id') id: string) {
    return this.pagesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update page' })
  @ApiResponse({ status: 200, description: 'Page updated successfully' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.update(id, updatePageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete page' })
  @ApiResponse({ status: 200, description: 'Page deleted successfully' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.pagesService.remove(id);
  }
}
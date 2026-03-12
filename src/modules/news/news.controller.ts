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
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new news article' })
  @ApiResponse({ status: 201, description: 'News article created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all news articles' })
  @ApiResponse({ status: 200, description: 'News articles retrieved successfully' })
  findAll(@Query('published') published?: string) {
    const publishedFilter = published === 'true' ? true : undefined;
    return this.newsService.findAll(publishedFilter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get news article by ID' })
  @ApiResponse({ status: 200, description: 'News article retrieved successfully' })
  @ApiResponse({ status: 404, description: 'News article not found' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update news article' })
  @ApiResponse({ status: 200, description: 'News article updated successfully' })
  @ApiResponse({ status: 404, description: 'News article not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete news article' })
  @ApiResponse({ status: 200, description: 'News article deleted successfully' })
  @ApiResponse({ status: 404, description: 'News article not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
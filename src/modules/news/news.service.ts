import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async create(createNewsDto: CreateNewsDto) {
    return this.prisma.news.create({
      data: createNewsDto,
    });
  }

  async findAll(published?: boolean) {
    const where = published !== undefined ? { published } : {};
    
    return this.prisma.news.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const news = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      throw new NotFoundException('News article not found');
    }

    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto) {
    const news = await this.prisma.news.update({
      where: { id },
      data: updateNewsDto,
    });

    if (!news) {
      throw new NotFoundException('News article not found');
    }

    return news;
  }

  async remove(id: string) {
    await this.prisma.news.delete({
      where: { id },
    });
    return { message: 'News article deleted successfully' };
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async create(createPageDto: CreatePageDto) {
    return this.prisma.page.create({
      data: createPageDto,
    });
  }

  async findAll(published?: boolean) {
    const where = published !== undefined ? { published } : {};
    
    return this.prisma.page.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const page = await this.prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async findBySlug(slug: string) {
    const page = await this.prisma.page.findUnique({
      where: { slug },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async update(id: string, updatePageDto: UpdatePageDto) {
    const page = await this.prisma.page.update({
      where: { id },
      data: updatePageDto,
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async remove(id: string) {
    await this.prisma.page.delete({
      where: { id },
    });
    return { message: 'Page deleted successfully' };
  }
}
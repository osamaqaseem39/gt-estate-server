import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  async create(createGalleryDto: CreateGalleryDto) {
    return this.prisma.gallery.create({
      data: createGalleryDto,
    });
  }

  async findAll(category?: string, featured?: boolean) {
    const where: any = {};
    if (category) where.category = category;
    if (featured !== undefined) where.featured = featured;

    return this.prisma.gallery.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const gallery = await this.prisma.gallery.findUnique({
      where: { id },
    });

    if (!gallery) {
      throw new NotFoundException('Gallery item not found');
    }

    return gallery;
  }

  async update(id: string, updateGalleryDto: UpdateGalleryDto) {
    const gallery = await this.prisma.gallery.update({
      where: { id },
      data: updateGalleryDto,
    });

    if (!gallery) {
      throw new NotFoundException('Gallery item not found');
    }

    return gallery;
  }

  async remove(id: string) {
    await this.prisma.gallery.delete({
      where: { id },
    });
    return { message: 'Gallery item deleted successfully' };
  }
}
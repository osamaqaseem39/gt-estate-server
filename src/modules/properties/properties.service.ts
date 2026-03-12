import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(createPropertyDto: CreatePropertyDto) {
    const { features, images, ...propertyData } = createPropertyDto;

    return this.prisma.property.create({
      data: {
        ...propertyData,
        features: {
          create: features || [],
        },
        images: {
          create: images || [],
        },
      },
      include: {
        features: true,
        images: true,
      },
    });
  }

  async findAll(filters?: {
    type?: string;
    status?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
  }) {
    const where: any = {};

    if (filters?.type) where.type = filters.type;
    if (filters?.status) where.status = filters.status;
    if (filters?.featured !== undefined) where.featured = filters.featured;
    if (filters?.minPrice || filters?.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }
    if (filters?.bedrooms) where.bedrooms = filters.bedrooms;
    if (filters?.bathrooms) where.bathrooms = filters.bathrooms;

    return this.prisma.property.findMany({
      where,
      include: {
        features: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        features: true,
        images: true,
        inquiries: true,
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
    const { features, images, ...propertyData } = updatePropertyDto;

    // Update property
    const property = await this.prisma.property.update({
      where: { id },
      data: propertyData,
    });

    // Update features if provided
    if (features) {
      await this.prisma.propertyFeature.deleteMany({
        where: { propertyId: id },
      });
      await this.prisma.propertyFeature.createMany({
        data: features.map(feature => ({
          ...feature,
          propertyId: id,
        })),
      });
    }

    // Update images if provided
    if (images) {
      await this.prisma.propertyImage.deleteMany({
        where: { propertyId: id },
      });
      await this.prisma.propertyImage.createMany({
        data: images.map(image => ({
          ...image,
          propertyId: id,
        })),
      });
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.prisma.property.delete({
      where: { id },
    });
    return { message: 'Property deleted successfully' };
  }
}
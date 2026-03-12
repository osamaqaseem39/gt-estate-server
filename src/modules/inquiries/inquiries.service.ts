import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';

@Injectable()
export class InquiriesService {
  constructor(private prisma: PrismaService) {}

  async create(createInquiryDto: CreateInquiryDto) {
    return this.prisma.inquiry.create({
      data: createInquiryDto,
    });
  }

  async findAll(status?: string) {
    const where = status ? { status } : {};
    
    return this.prisma.inquiry.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            location: true,
          },
        },
      },
    });

    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }

    return inquiry;
  }

  async update(id: string, updateInquiryDto: UpdateInquiryDto) {
    const inquiry = await this.prisma.inquiry.update({
      where: { id },
      data: updateInquiryDto,
    });

    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }

    return inquiry;
  }

  async remove(id: string) {
    await this.prisma.inquiry.delete({
      where: { id },
    });
    return { message: 'Inquiry deleted successfully' };
  }
}
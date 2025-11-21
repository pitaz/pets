import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(slug: string) {
    return this.prisma.tag.findUnique({
      where: { slug },
      include: {
        pets: {
          where: { status: 'PUBLISHED' },
          include: {
            media: true,
            tags: true,
          },
        },
      },
    });
  }
}


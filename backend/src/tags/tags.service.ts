import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const tags = await this.prisma.tag.findMany({
        orderBy: { name: 'asc' },
      });
      // Return empty array if no tags found (not an error)
      return tags || [];
    } catch (error) {
      this.logger.error('Error fetching all tags', error);
      throw error;
    }
  }

  async findOne(slug: string) {
    try {
      return await this.prisma.tag.findUnique({
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
    } catch (error) {
      this.logger.error(`Error fetching tag with slug: ${slug}`, error);
      throw error;
    }
  }
}

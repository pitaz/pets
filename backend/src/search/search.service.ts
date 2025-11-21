import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, limit: number = 10) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    // Simple PostgreSQL full-text search
    // For production, consider using Elasticsearch or Algolia
    const pets = await this.prisma.pet.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { commonName: { contains: query, mode: 'insensitive' } },
          { scientificName: { contains: query, mode: 'insensitive' } },
          { shortIntro: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        media: true,
        tags: true,
      },
      take: limit,
      orderBy: { publishedAt: 'desc' },
    });

    return pets;
  }

  async suggestions(query: string, limit: number = 5) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const pets = await this.prisma.pet.findMany({
      where: {
        status: 'PUBLISHED',
        commonName: { startsWith: query, mode: 'insensitive' },
      },
      select: {
        id: true,
        slug: true,
        commonName: true,
      },
      take: limit,
    });

    return pets;
  }
}


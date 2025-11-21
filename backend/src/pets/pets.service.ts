import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { QueryPetsDto } from './dto/query-pets.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async create(createPetDto: CreatePetDto) {
    const { tags, classifications, ...petData } = createPetDto;

    const data: Prisma.PetCreateInput = {
      ...petData,
      publishedAt: createPetDto.status === 'PUBLISHED' ? new Date() : null,
      tags: tags
        ? {
            connectOrCreate: tags.map((tagName) => ({
              where: { name: tagName },
              create: { name: tagName, slug: this.slugify(tagName) },
            })),
          }
        : undefined,
      classifications: classifications
        ? {
            create: classifications,
          }
        : undefined,
    };

    const pet = await this.prisma.pet.create({
      data,
      include: {
        media: true,
        tags: true,
        classifications: true,
      },
    });

    return pet;
  }

  async findAll(query: QueryPetsDto) {
    const {
      q,
      tag,
      classification,
      status = 'PUBLISHED',
      page = 1,
      limit = 20,
      sort = 'publishedAt',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.PetWhereInput = {
      status,
      ...(q && {
        OR: [
          { commonName: { contains: q, mode: 'insensitive' } },
          { scientificName: { contains: q, mode: 'insensitive' } },
          { shortIntro: { contains: q, mode: 'insensitive' } },
        ],
      }),
      ...(tag && {
        tags: {
          some: {
            name: { equals: tag, mode: 'insensitive' },
          },
        },
      }),
      ...(classification && {
        classifications: {
          some: {
            value: { contains: classification, mode: 'insensitive' },
          },
        },
      }),
    };

    const [pets, total] = await Promise.all([
      this.prisma.pet.findMany({
        where,
        include: {
          media: true,
          tags: true,
          classifications: true,
        },
        skip,
        take: limit,
        orderBy: {
          [sort]: 'desc',
        },
      }),
      this.prisma.pet.count({ where }),
    ]);

    return {
      data: pets,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(slug: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { slug },
      include: {
        media: true,
        tags: true,
        classifications: true,
        comments: {
          where: { status: 'APPROVED' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    return pet;
  }

  async update(id: string, updatePetDto: UpdatePetDto) {
    const { tags, classifications, ...petData } = updatePetDto;

    const existingPet = await this.prisma.pet.findUnique({
      where: { id },
    });

    if (!existingPet) {
      throw new NotFoundException('Pet not found');
    }

    const data: Prisma.PetUpdateInput = {
      ...petData,
      ...(updatePetDto.status === 'PUBLISHED' && !existingPet.publishedAt && {
        publishedAt: new Date(),
      }),
      ...(tags && {
        tags: {
          set: [],
          connectOrCreate: tags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName, slug: this.slugify(tagName) },
          })),
        },
      }),
      ...(classifications && {
        classifications: {
          deleteMany: {},
          create: classifications,
        },
      }),
    };

    const pet = await this.prisma.pet.update({
      where: { id },
      data,
      include: {
        media: true,
        tags: true,
        classifications: true,
      },
    });

    return pet;
  }

  async remove(id: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    await this.prisma.pet.delete({
      where: { id },
    });

    return { message: 'Pet deleted successfully' };
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}


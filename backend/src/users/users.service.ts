import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        bookmarks: {
          include: {
            pet: {
              include: {
                media: true,
                tags: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async addBookmark(userId: string, petId: string) {
    // Check if pet exists
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    // Check if bookmark already exists
    const existing = await this.prisma.bookmark.findUnique({
      where: {
        userId_petId: {
          userId,
          petId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Bookmark already exists');
    }

    return this.prisma.bookmark.create({
      data: {
        userId,
        petId,
      },
      include: {
        pet: {
          include: {
            media: true,
            tags: true,
          },
        },
      },
    });
  }

  async removeBookmark(userId: string, petId: string) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_petId: {
          userId,
          petId,
        },
      },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    await this.prisma.bookmark.delete({
      where: {
        userId_petId: {
          userId,
          petId,
        },
      },
    });

    return { message: 'Bookmark removed' };
  }
}


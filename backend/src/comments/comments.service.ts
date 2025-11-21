import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCommentDto: CreateCommentDto) {
    const { petId, content } = createCommentDto;

    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    return this.prisma.comment.create({
      data: {
        userId,
        petId,
        content,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(petId: string) {
    return this.prisma.comment.findMany({
      where: {
        petId,
        status: 'APPROVED',
      },
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
    });
  }

  async approve(id: string) {
    return this.prisma.comment.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }

  async reject(id: string) {
    return this.prisma.comment.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }
}


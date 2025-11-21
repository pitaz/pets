import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.EDITOR)
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get('stats')
  async getStats() {
    const [petsCount, usersCount, commentsCount, mediaCount] = await Promise.all([
      this.prisma.pet.count(),
      this.prisma.user.count(),
      this.prisma.comment.count(),
      this.prisma.media.count(),
    ]);

    return {
      pets: petsCount,
      users: usersCount,
      comments: commentsCount,
      media: mediaCount,
    };
  }

  @Get('audit')
  @Roles(UserRole.ADMIN)
  async getAuditLogs() {
    return this.prisma.auditLog.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }
}


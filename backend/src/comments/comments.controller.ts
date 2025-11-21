import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('pet/:petId')
  findAll(@Param('petId') petId: string) {
    return this.commentsService.findAll(petId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(req.user.id, createCommentDto);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  approve(@Param('id') id: string) {
    return this.commentsService.approve(id);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  reject(@Param('id') id: string) {
    return this.commentsService.reject(id);
  }
}


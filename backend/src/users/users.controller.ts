import { Controller, Get, Post, Delete, Param, UseGuards, Request, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Post('me/bookmarks')
  @UseGuards(JwtAuthGuard)
  async addBookmark(@Request() req, @Body() body: { petId: string }) {
    return this.usersService.addBookmark(req.user.id, body.petId);
  }

  @Delete('me/bookmarks/:petId')
  @UseGuards(JwtAuthGuard)
  async removeBookmark(@Request() req, @Param('petId') petId: string) {
    return this.usersService.removeBookmark(req.user.id, petId);
  }
}

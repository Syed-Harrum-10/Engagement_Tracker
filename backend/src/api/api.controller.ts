// api.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiService } from './api.service';
import { CreateEventDto, CreateUserDto, LoginDto } from './DTO/apiDTO';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JWT_COOKIE_NAME } from '../auth/jwt.constants';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('images')
  getImages(@Query('category') category?: string) {
    return this.apiService.getImages(category);
  }

  @Get('images/:id')
  getImageById(@Param('id', ParseIntPipe) id: number) {
    return this.apiService.getImageById(id);
  }

  @Post('users/register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.apiService.createUser(
      createUserDto.name,
      createUserDto.password,
      createUserDto.email,
    );
  }

  @Post('users/login')
  async Login(
    @Body() LoginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.apiService.login(
      LoginDto.email,
      LoginDto.password,
    );

    response.cookie(JWT_COOKIE_NAME, result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('events')
  createEvent(@Body() eventDto: CreateEventDto) {
    return this.apiService.createEvent(
      eventDto.userId,
      eventDto.imageId,
      eventDto.dwellSeconds,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:userId/interests')
  getInterests(@Param('userId', ParseIntPipe) userId: number) {
    return this.apiService.getInterests(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:userId/feed')
  getFeed(@Param('userId', ParseIntPipe) userId: number) {
    return this.apiService.getFeed(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('analytics/top-categories')
  topCategories() {
    return this.apiService.topCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Get('analytics/views-per-day')
  viewsPerDay() {
    return this.apiService.viewsPerDay();
  }
}

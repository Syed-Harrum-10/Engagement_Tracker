// api.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateEventDto, CreateUserDto } from '../api/DTO/apiDTO';

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

  @Post('users')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.apiService.createUser(createUserDto.email);
  }

  @Post('events')
  createEvent(@Body() eventDto: CreateEventDto) {
    return this.apiService.createEvent(
      eventDto.userId,
      eventDto.imageId,
      eventDto.dwellSeconds,
    );
  }

  @Get('users/:userId/interests')
  getInterests(@Param('userId', ParseIntPipe) userId: number) {
    return this.apiService.getInterests(userId);
  }

  @Get('users/:userId/feed')
  getFeed(@Param('userId', ParseIntPipe) userId: number) {
    return this.apiService.getFeed(userId);
  }

  @Get('analytics/top-categories')
  topCategories() {
    return this.apiService.topCategories();
  }

  @Get('analytics/views-per-day')
  viewsPerDay() {
    return this.apiService.viewsPerDay();
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiQuery } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';

@Controller('recommendations')
export class RecommendationController {
  constructor(
    private recommendationService: RecommendationService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get('description')
  async getDescRecommendation() {
    return this.recommendationService.getDescRecommendation();
  }

  @Get('location')
  @ApiQuery({ name: 'lat' })
  @ApiQuery({ name: 'lng' })
  @ApiQuery({ name: 'radius', required: false })
  async locationBasedRecommender(
    @Query('lat') lat: any,
    @Query('lng') lng: any,
    @Query('radius') radius = 10,
  ) {
    console.log(lat, lng, radius);
    return this.recommendationService.getLocRecommendation(lat, lng, radius);
  }
}

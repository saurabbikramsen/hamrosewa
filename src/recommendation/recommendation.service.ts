import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';
import { pointsWithinGivenkm } from './helper/location_recommender';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RecommendationService {
  private openAi: any;
  constructor(
    private readonly prismaService: PrismaService,
    private config: ConfigService,
  ) {
    this.openAi = new OpenAI({
      apiKey: this.config.get('OPENAI_API_KEY'),
    });
  }
  async getDescRecommendation() {
    const vendors = await this.prismaService.vendor.findMany({
      select: {
        id: true,
        description: true,
        name: true,
      },
    });
    const completion = await this.openAi.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `
          ${JSON.stringify(vendors)}
          from this json filter the item only which have very descriptive description about its service else discard them, rank them in the order of the description it has just give me around 5 items, and if it does not have any description then remove it, do not complicate it, keep it simple and solve it
          please anyhow return me only 5 items and in json format and give me json, only json no other extra texts and in plain text format not in markdown format in plain string format and do not write other stuff like sure here's an json or any explanation, do not send in markdown format or in code format, only in plain string format
        `,
        },
      ],
      model: 'gpt-3.5-turbo',
    });
    return JSON.parse(completion.choices[0].message.content);
  }

  async getLocRecommendation(lat, lng, radius) {
    const vendors = await this.prismaService.vendor.findMany({
      include: {
        location: true,
      },
    });

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const nearest_vendors = pointsWithinGivenkm(
      vendors,
      latitude,
      longitude,
      radius,
    );
    console.log(nearest_vendors);
    const highestValueFrequency = nearest_vendors.reduce(
      (max, obj) => (obj.visited_frequency > max ? obj.visited_frequency : max),
      -Infinity,
    );
    console.log(`max: ${highestValueFrequency}`);
    const vendorsData = nearest_vendors.map((vendor) => {
      const visitedRating =
        (vendor.rating / 5) * 70 +
        (vendor.visited_frequency / highestValueFrequency) * 30;
      console.log(`visitedRating: ${visitedRating}`);
      return { ...vendor, visitedRating: visitedRating };
    });

    vendorsData.sort((a, b) => b.visitedRating - a.visitedRating);
    return vendorsData;
  }
}

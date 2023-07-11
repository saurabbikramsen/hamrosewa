import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ServicesDto } from './Dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async getServices() {
    return this.prisma.services.findMany();
  }

  async addService(serviceDetails: ServicesDto) {
    await this.prisma.services.create({
      data: { ...serviceDetails, image_url: 'img' },
    });
    return { msg: 'service added successfully' };
  }

  async updateService(id, serviceDetails: ServicesDto) {
    const service = await this.prisma.services.findFirst({ where: { id } });
    if (!service) {
      throw new NotFoundException('service not found');
    }
    await this.prisma.services.update({
      where: { id },
      data: { ...serviceDetails, image_url: 'img' },
    });
    return { msg: 'service updated successfully' };
  }

  async deleteService(id) {
    const service = await this.prisma.services.findFirst({ where: { id } });
    if (!service) {
      throw new NotFoundException('service not found');
    }
    await this.prisma.services.delete({ where: { id } });
    return { msg: 'service deleted successfully' };
  }
}

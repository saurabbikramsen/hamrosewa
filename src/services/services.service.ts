import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ServicesDto } from './Dto';
import { BufferedFile } from '../minio-client/file.model';
import { MinioClientService } from '../minio-client/minio-client.service';

@Injectable()
export class ServicesService {
  constructor(
    private prisma: PrismaService,
    private minio: MinioClientService,
  ) {}

  async getInteractions() {
    return this.prisma.interaction.findMany({
      include: {
        service: true,
        user: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            name: true,
            email: true,
            contact: true,
            state: true,
            city: true,
            postal_code: true,
            street: true,
            number: true,
          },
        },
      },
    });
  }
  async getSearchService(searchKey, userId) {
    const service = await this.prisma.services.findFirst({
      where: { name: { contains: searchKey } },
    });
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (service) {
      await this.prisma.interaction.create({
        data: {
          user: { connect: { id: user.id } },
          service: { connect: { id: service.id } },
          interaction_type: 'search',
        },
      });
    }
    return service;
  }
  async getServices() {
    return this.prisma.services.findMany();
  }

  async addService(serviceDetails: ServicesDto, serviceImage: BufferedFile) {
    try {
      const image_url = await this.minio.upload(serviceImage);
      await this.prisma.services.create({
        data: { ...serviceDetails, image_url: image_url.url },
      });
      return { msg: 'service added successfully' };
    } catch (err) {
      throw err;
    }
  }

  async updateService(id, serviceDetails: ServicesDto, image: BufferedFile) {
    const service = await this.prisma.services.findFirst({ where: { id } });
    if (!service) {
      throw new NotFoundException('service not found');
    }
    const image_url = await this.minio.upload(image);
    await this.prisma.services.update({
      where: { id },
      data: { ...serviceDetails, image_url: image_url.url },
    });
    return { msg: 'service updated successfully' };
  }

  async deleteService(id: number) {
    const service = await this.prisma.services.findFirst({ where: { id } });
    if (!service) {
      throw new NotFoundException('service not found');
    }
    await this.prisma.services.delete({ where: { id } });
    return { message: 'service deleted successfully' };
  }
}

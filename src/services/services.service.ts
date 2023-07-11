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

  async deleteService(id) {
    const service = await this.prisma.services.findFirst({ where: { id } });
    if (!service) {
      throw new NotFoundException('service not found');
    }
    const image_url = service.image_url;
    const image_name = image_url.substring(
      image_url.lastIndexOf('/'),
      image_url.length,
    );
    console.log(image_name);
    await this.prisma.services.delete({ where: { id } });
    await this.minio.delete(image_name);
    return { msg: 'service deleted successfully' };
  }
}

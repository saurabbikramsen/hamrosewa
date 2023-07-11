import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesDto } from './Dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '../minio-client/file.model';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private serviceService: ServicesService) {}

  @Get()
  getServices() {
    return this.serviceService.getServices();
  }

  @Post()
  @UseInterceptors(FileInterceptor('service_image'))
  addService(
    @Body() servicesDto: ServicesDto,
    @UploadedFile() image: BufferedFile,
  ) {
    return this.serviceService.addService(servicesDto, image);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('service_image'))
  updateService(
    @Param('id', ParseIntPipe) id: number,
    @Body() servicesDto: ServicesDto,
    @UploadedFile() image: BufferedFile,
  ) {
    return this.serviceService.updateService(id, servicesDto, image);
  }

  @Delete(':id')
  deleteService(@Param('id', ParseIntPipe) id: number) {
    return this.serviceService.deleteService(id);
  }
}

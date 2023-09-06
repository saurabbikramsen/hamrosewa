import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesDto } from './Dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '../minio-client/file.model';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private serviceService: ServicesService) {}

  @ApiQuery({ name: 'searchKey', required: false, type: String })
  @ApiQuery({ name: 'userId', required: true, type: Number })
  @Get('search')
  getSearchService(
    @Query('searchKey') searchKey = '',
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.serviceService.getSearchService(searchKey, userId);
  }

  @Get('/interaction')
  getInteraction() {
    return this.serviceService.getInteractions();
  }
  @Get()
  getServices() {
    console.log('hello get services');
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
    console.log('k xaa');
    return this.serviceService.deleteService(id);
  }
}

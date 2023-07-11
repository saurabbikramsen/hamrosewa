import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesDto } from './Dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private serviceService: ServicesService) {}

  @Get()
  getServices() {
    return this.serviceService.getServices();
  }

  @Post()
  addService(@Body() servicesDto: ServicesDto) {
    return this.serviceService.addService(servicesDto);
  }

  @Put(':id')
  updateService(
    @Param('id', ParseIntPipe) id: number,
    @Body() servicesDto: ServicesDto,
  ) {
    return this.serviceService.updateService(id, servicesDto);
  }

  @Delete(':id')
  deleteService(@Param('id', ParseIntPipe) id: number) {
    return this.serviceService.deleteService(id);
  }
}

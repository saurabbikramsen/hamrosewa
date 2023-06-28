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
import { VendorService } from './vendor.service';
import { VendorDto } from './Dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('vendor')
@Controller('vendor')
export class VendorController {
  constructor(private vendorService: VendorService) {}

  @Get()
  getVendors() {
    return this.vendorService.getVendors();
  }

  @Post('add')
  addVendor(@Body() vendorDto: VendorDto) {
    return this.vendorService.addVendor(vendorDto);
  }

  @Put('update/:id')
  @ApiParam({ name: 'id', type: 'number', description: 'Vendor Id' })
  updateVendor(
    @Param('id', ParseIntPipe) id: number,
    @Body() vendorDto: VendorDto,
  ) {
    return this.vendorService.updateVendor(id, vendorDto);
  }

  @Delete('delete/:id')
  @ApiParam({ name: 'id', type: 'number', description: 'Vendor Id' })
  deleteVendor(@Param('id', ParseIntPipe) id: number) {
    return this.vendorService.deleteVendor(id);
  }
}

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
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorDto } from './Dto';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ErrorHandlingPipes } from '../Pipes/lowerCasePipe';
import { ResponseInspector } from '../interceptor/response_interceptor ';

@ApiTags('vendor')
@Controller('vendor')
export class VendorController {
  constructor(private vendorService: VendorService) {}

  @Get()
  @UseInterceptors(ResponseInspector)
  getVendors(): Promise<any> {
    return this.vendorService.getVendors();
  }

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'searchKey', required: false, type: String })
  @Get('get')
  async getOnly(
    @Query('page', ParseIntPipe) page = 1,
    @Query('pageSize', ParseIntPipe) pageSize = 50,
    @Query('searchKey') searchKey = '',
  ) {
    const take = pageSize ? pageSize : 5;
    const skip = page ? (page - 1) * pageSize : 0;

    const result = await this.vendorService.getOnly(take, skip, searchKey);

    const totalPages = Math.ceil(result.count / take);

    const nextPage =
      page < totalPages
        ? `vendor/?page=${page + 1}&pageSize=${take}&searchKey=${searchKey}`
        : null;

    const prevPage =
      page > 1
        ? `vendor/?page=${page - 1}&pageSize=${take}&searchKey=${searchKey}`
        : null;

    return {
      data: result.vendors,
      pageInfo: {
        count: result.count,
        currentPage: page,
        pageSize: take,
        totalPages,
        nextPage,
        prevPage,
      },
    };
  }

  @Get('/:id')
  getVendorInfo(@Param('id', ParseIntPipe) id: number) {
    return this.vendorService.getVendorInfo(id);
  }
  @Post('add')
  @UsePipes(ErrorHandlingPipes)
  addVendor(@Body() vendorDto: VendorDto) {
    return this.vendorService.addVendor(vendorDto);
  }

  @Put('update/:id')
  @ApiParam({ name: 'id', type: 'number', description: 'Vendor Id' })
  @UsePipes(ErrorHandlingPipes)
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

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
  UsePipes,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorDto } from './Dto';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ErrorHandlingPipes } from '../Pipes/lowerCasePipe';
import { ResponseInspector } from '../interceptor/response_interceptor ';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '../minio-client/file.model';

@ApiTags('vendor')
@Controller('vendor')
export class VendorController {
  constructor(private vendorService: VendorService) {}

  @Get('recommendations')
  getVendorsRecommendation(): Promise<any> {
    return this.vendorService.getVendorsRecommendation();
  }
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

  @Get('detail')
  getVendorInfo(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('vendorId', ParseIntPipe) vendorId: number,
  ) {
    return this.vendorService.getVendorInfo(userId, vendorId);
  }

  @Get('booking/:id')
  getVendorBooking(@Param('id', ParseIntPipe) id: number) {
    return this.vendorService.getVendorBookings(id);
  }

  @Post()
  @UsePipes(ErrorHandlingPipes)
  @UseInterceptors(FileInterceptor('service_image'))
  addVendor(@Body() vendorDto: VendorDto, @UploadedFile() image: BufferedFile) {
    return this.vendorService.addVendor(vendorDto, image);
  }

  @Get('payment/:id')
  getVendorPayment(@Param('id', ParseIntPipe) id: number) {
    return this.vendorService.getVendorPayment(id);
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

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
import { BookingsService } from './bookings.service';
import { BookingsDto } from './Dto';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private bookingService: BookingsService) {}

  @SkipThrottle(false)
  @Get()
  getBookings() {
    return this.bookingService.getBookings();
  }

  @Post('add')
  addBooking(@Body() bookingsDto: BookingsDto) {
    return this.bookingService.addBooking(bookingsDto);
  }

  @Put('update/:id')
  updateBooking(
    @Param('id', ParseIntPipe) id: number,
    @Body() bookingsDto: BookingsDto,
  ) {
    return this.bookingService.updateBooking(id, bookingsDto);
  }

  @Delete('delete/:id')
  deleteBooking(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.deleteBooking(id);
  }
}

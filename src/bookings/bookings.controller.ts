import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { AcceptBookingDto, BookingsDto } from './Dto';
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

  @Patch('accept/:id')
  acceptBooking(
    @Body() acceptBookingDto: AcceptBookingDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bookingService.acceptBooking(id, acceptBookingDto);
  }
  @Post()
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

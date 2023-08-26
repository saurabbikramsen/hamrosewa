import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingsDto } from './Dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async getBookings() {
    return this.prisma.booking.findMany({
      include: { user: true, vendor: true },
    });
  }

  async addBooking(bookingDetails: BookingsDto) {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id: bookingDetails.vendor_id },
    });
    const service = await this.prisma.services.findFirst({
      where: { name: { contains: vendor.service_type } },
    });
    await this.prisma.interaction.create({
      data: {
        service: {
          connect: {
            id: service.id,
          },
        },
        user: {
          connect: {
            id: bookingDetails.user_id,
          },
        },
        interaction_type: 'booking',
      },
    });

    return this.prisma.booking.create({
      data: {
        booked_date: bookingDetails.booked_date,
        status: bookingDetails.status,
        user: {
          connect: {
            id: bookingDetails.user_id,
          },
        },
        vendor: {
          connect: {
            id: bookingDetails.vendor_id,
          },
        },
      },
    });
  }

  async updateBooking(id, bookingDetails: BookingsDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException('booking not found');
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        ...bookingDetails,
      },
    });
  }

  async deleteBooking(id) {
    const booking = await this.prisma.booking.findFirst({ where: { id } });
    if (!booking) {
      throw new NotFoundException('booking not found');
    }
    await this.prisma.booking.delete({ where: { id } });
    return {
      message: 'booking deleted successfully',
    };
  }
}

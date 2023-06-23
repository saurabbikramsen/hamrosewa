import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleMapsService } from '../googlemaps/googlemaps.service';
import { VendorDto } from './Dto';

@Injectable()
export class VendorService {
  constructor(
    private readonly googleMaps: GoogleMapsService,
    private prisma: PrismaService,
  ) {}

  async getVendors() {
    return this.prisma.vendor.findMany({
      include: {
        location: true,
      },
    });
  }

  async addVendor(vendorDetails: VendorDto) {
    try {
      console.log(vendorDetails);
      let location: any = {};
      const vendor = await this.prisma.vendor.findFirst({
        where: { email: vendorDetails.email },
      });
      if (!vendor) {
        if (
          vendorDetails.lat === -82.2196534 &&
          vendorDetails.lng === 56.81587
        ) {
          const co_ordinates = await this.getLocation(vendorDetails);
          location = await this.prisma.location.create({
            data: {
              longitude: co_ordinates.lng,
              latitude: co_ordinates.lat,
            },
          });
        } else {
          location = await this.prisma.location.create({
            data: { longitude: vendorDetails.lng, latitude: vendorDetails.lat },
          });
        }
        await this.prisma.vendor.create({
          data: {
            name: vendorDetails.name,
            email: vendorDetails.email,
            contact: vendorDetails.contact,
            service_type: vendorDetails.service_type,
            street: vendorDetails.street,
            state: vendorDetails.state,
            city: vendorDetails.city,
            postal_code: vendorDetails.postal_code,
            number: vendorDetails.number,
            location: {
              connect: {
                id: location.id,
              },
            },
          },
        });
        return { msg: 'Vendor added Successfully' };
      } else {
        throw new BadRequestException('EMAIL ALREADY EXISTS');
      }
    } catch (error) {
      throw error;
    }
  }

  async updateVendor(id, vendorDetails: VendorDto) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id } });
    if (!vendor) {
      throw new NotFoundException('vendor not found');
    }
    const co_ordinates = await this.getLocation(vendorDetails);

    await this.prisma.location.update({
      where: { id: vendor.locationId },
      data: { longitude: co_ordinates.lng, latitude: co_ordinates.lat },
    });
    return this.prisma.vendor.update({
      where: { id },
      data: {
        ...vendorDetails,
      },
    });
  }

  async deleteVendor(id) {
    const vendor = await this.prisma.vendor.findFirst({ where: { id } });
    if (!vendor) {
      throw new NotFoundException('vendor not found');
    }
    await this.prisma.vendor.delete({ where: { id } });
    return {
      message: 'vendor deleted successfully',
    };
  }

  async getLocation(vendorDetails) {
    const address = {
      state: vendorDetails.state,
      city: vendorDetails.city,
      street: vendorDetails.street,
      postalCode: vendorDetails.postal_code,
      number: vendorDetails.number,
    };

    return this.googleMaps.getCoordinates(address);
  }
}

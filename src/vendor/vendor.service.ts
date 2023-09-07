import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleMapsService } from '../googlemaps/googlemaps.service';
import { VendorDto, VendorLoginDto } from './Dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { ClusterService } from '../cluster/cluster.service';
import { BufferedFile } from '../minio-client/file.model';
import { MinioClientService } from '../minio-client/minio-client.service';

@Injectable()
export class VendorService {
  constructor(
    private readonly googleMaps: GoogleMapsService,
    private prisma: PrismaService,
    private config: ConfigService,
    private cluster: ClusterService,
    private jwt: JwtService,
    private minio: MinioClientService,
  ) {}

  async getVendorsRecommendation() {}
  async getVendorInfo(userId: number, vendorId: number) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });
    await this.cluster.addProfileViews(userId, vendorId);
    const vf = vendor.visited_frequency + 1;
    return this.prisma.vendor.update({
      where: { id: vendorId },
      data: { visited_frequency: vf },
    });
  }

  async getVendorPayment(id: number) {
    console.log(id);
    const vendor = await this.prisma.vendor.findFirst({
      where: { id },
      include: {
        payment: { include: { booking: { include: { user: true } } } },
      },
    });
    console.log(vendor.payment);
    return vendor;
  }
  async getVendorBookings(id: number) {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id },
      include: {
        booking: { include: { user: true, payment: true } },
      },
    });
    console.log(vendor);
    const bookings = vendor.booking.filter((booking) => {
      if (
        booking?.status == 'canceled' ||
        booking?.status == 'pending' ||
        (booking?.status == 'accepted' && booking.payment?.status != 'Paid')
      ) {
        return booking;
      }
    });
    console.log(bookings);
    return bookings;
  }

  async login(loginDetails: VendorLoginDto) {
    const vendor = await this.prisma.vendor.findFirst({
      where: { email: loginDetails.email },
    });
    if (!vendor) {
      throw new NotFoundException('No user found for this email');
    }
    const pwMatches = await argon.verify(
      vendor.password,
      loginDetails.password,
    );
    if (!pwMatches) {
      throw new UnauthorizedException('Email or password does not match');
    }
    const payload = {
      email: vendor.email,
      role: 'vendor',
    };
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      msg: `welcome ${vendor.name}`,
    };
  }
  async getOnly(take, skip, searchKey) {
    const vendors = await this.prisma.vendor.findMany({
      where: { name: { contains: searchKey } },
      skip,
      take,
    });
    const count = await this.prisma.vendor.count({
      where: { name: { contains: searchKey } },
    });
    return { vendors, count };
  }
  async getVendors() {
    return this.prisma.vendor.findMany({ include: { location: true } });
  }

  async addVendor(vendorDetails: VendorDto, vendor_image: BufferedFile) {
    try {
      let image_url = {
        url: 'localhost:9000/hamrosewa/d82ef74fcc41ee18913c43610c5013ab.jpg',
      };
      if (vendor_image) {
        image_url = await this.minio.upload(vendor_image);
      }
      let location: any = {};
      const vendor = await this.prisma.vendor.findFirst({
        where: { email: vendorDetails.email },
      });
      if (!vendor) {
        if (
          vendorDetails.lat === -82.2196534 &&
          vendorDetails.lng === 56.81587
        ) {
          const co_ordinates: any = await this.getLocation(vendorDetails);
          // location = await this.prisma.location.create({
          //   data: {
          //     longitude: co_ordinates.lng,
          //     latitude: co_ordinates.lat,
          //   },
          // });
          location = await this.prisma
            .$executeRaw`insert into location (latitude, longitude) values (${co_ordinates.lat}, ${co_ordinates.lng})`;
        } else {
          location = await this.prisma.location.create({
            data: { longitude: vendorDetails.lng, latitude: vendorDetails.lat },
          });
        }
        const hashPassword = await argon.hash(vendorDetails.password);
        const vend = await this.prisma.vendor.create({
          data: {
            name: vendorDetails.name,
            email: vendorDetails.email,
            contact: vendorDetails.contact,
            service_type: vendorDetails.service_type,
            street: vendorDetails.street,
            password: hashPassword,
            state: vendorDetails.state,
            image_url: image_url.url,
            city: vendorDetails.city,
            postal_code: vendorDetails.postal_code,
            number: vendorDetails.number,
            description: vendorDetails.description,
            location: {
              connect: {
                id: location.id,
              },
            },
          },
        });

        const payload = {
          email: vend.email,
          role: 'vendor',
        };
        const accessToken = await this.generateAccessToken(payload);
        const refreshToken = await this.generateRefreshToken(payload);

        return {
          accessToken: accessToken,
          refreshToken: refreshToken,
          msg: `welcome ${vend.name}`,
          vend: vend.name,
          vendor_id: vend.id,
        };
      } else {
        throw new BadRequestException('Email already exists');
      }
    } catch (error) {
      throw error;
    }
  }

  async updateVendor(id: number, vendorDetails: VendorDto) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id } });
    if (!vendor) {
      throw new NotFoundException('vendor not found');
    }
    const co_ordinates: any = await this.getLocation(vendorDetails);

    // await this.prisma.location.update({
    //   where: { id: vendor.locationId },
    //   data: { longitude: co_ordinates.lng, latitude: co_ordinates.lat },
    // });
    await this.prisma
      .$executeRaw`Update location set longitude=${co_ordinates.lng} latitude=${co_ordinates.lat} where id=${vendor.locationId}`;

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

  async generateAccessToken(payload) {
    const secret = this.config.get('ACCESS_TOKEN_SECRET');
    return this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: secret,
    });
  }
  async generateRefreshToken(payload) {
    const secret = this.config.get<string>('REFRESH_TOKEN_SECRET');
    return this.jwt.signAsync(payload, {
      secret,
      expiresIn: '2h',
    });
  }
}

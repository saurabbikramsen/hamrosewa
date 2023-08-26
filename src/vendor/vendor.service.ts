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

@Injectable()
export class VendorService {
  constructor(
    private readonly googleMaps: GoogleMapsService,
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

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
        };
      } else {
        throw new BadRequestException('Email already exists');
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

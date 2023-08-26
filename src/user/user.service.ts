import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleMapsService } from '../googlemaps/googlemaps.service';
import { loginDto, UserDto } from './Dto';
import { ConfigService } from '@nestjs/config';

import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  async;

  constructor(
    private readonly googleMaps: GoogleMapsService,
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async getUsers() {
    return this.prisma.user.findMany({
      include: {
        location: true,
      },
    });
  }

  async loginUser(loginDetails: loginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: loginDetails.email },
    });
    if (!user) {
      throw new NotFoundException('User Not found');
    }
    const pwMatches = await argon.verify(user.password, loginDetails.password);
    if (!pwMatches) {
      throw new HttpException(
        "password or email doesn't match",
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = {
      email: user.email,
      role: 'user',
    };

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      msg: `welcome ${user.name}`,
    };
  }

  async addUser(userDetails: UserDto) {
    console.log(userDetails);
    let location: any = {};
    const user = await this.prisma.user.findFirst({
      where: { email: userDetails.email },
    });
    if (!user) {
      if (userDetails.lat === -82.2196534 && userDetails.lng === 56.81587) {
        const co_ordinates = await this.getLocation(userDetails);
        location = await this.prisma.location.create({
          data: {
            longitude: co_ordinates.lng,
            latitude: co_ordinates.lat,
          },
        });
      } else {
        location = await this.prisma.location.create({
          data: { longitude: userDetails.lng, latitude: userDetails.lat },
        });
      }
      const passwordHash = await argon.hash(userDetails.password);
      await this.prisma.user.create({
        data: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.contact,
          street: userDetails.street,
          state: userDetails.state,
          password: passwordHash,
          city: userDetails.city,
          postal_code: userDetails.postal_code,
          number: userDetails.number,
          location: {
            connect: {
              id: location.id,
            },
          },
        },
      });
      const payload = {
        email: userDetails.email,
        role: 'user',
      };

      const accessToken = await this.generateAccessToken(payload);
      const refreshToken = await this.generateRefreshToken(payload);

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        msg: `welcome ${userDetails.name}`,
      };
    } else {
      throw new BadRequestException('EMAIL ALREADY EXISTS');
    }
  }

  async updateUser(id, userDetails: UserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const co_ordinates = await this.getLocation(userDetails);

    const location = await this.prisma.location.update({
      where: { id: user.locationId },
      data: { longitude: co_ordinates.lng, latitude: co_ordinates.lat },
    });
    await this.prisma.user.update({
      where: { id },
      data: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.contact,
        street: userDetails.street,
        state: userDetails.state,
        password: user.password,
        city: userDetails.city,
        postal_code: userDetails.postal_code,
        number: userDetails.number,
        location: {
          connect: {
            id: location.id,
          },
        },
      },
    });
    return {
      msg: 'User updated Successfully',
    };
  }

  async deleteUser(id) {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    await this.prisma.user.delete({ where: { id } });
    return {
      message: 'user deleted successfully',
    };
  }

  async getLocation(userDetails) {
    const address = {
      state: userDetails.state,
      city: userDetails.city,
      street: userDetails.street,
      postalCode: userDetails.postal_code,
      number: userDetails.number,
    };

    return this.googleMaps.getCoordinates(address);
  }

  async generateAccessToken(load) {
    const secret = this.config.get('ACCESS_TOKEN_SECRET');
    return this.jwt.signAsync(load, {
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

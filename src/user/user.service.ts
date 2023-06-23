import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleMapsService } from '../googlemaps/googlemaps.service';
import { UserDto } from './Dto';

@Injectable()
export class UserService {
  async;

  constructor(
    private readonly googleMaps: GoogleMapsService,
    private prisma: PrismaService,
  ) {}

  async getUsers() {
    return this.prisma.user.findMany({
      include: {
        location: true,
      },
    });
  }

  async addUser(userDetails: UserDto) {
    console.log(userDetails);
    const user = await this.prisma.user.findFirst({
      where: { email: userDetails.email },
    });
    if (!user) {
      const co_ordinates = await this.getLocation(userDetails);
      const location = await this.prisma.location.create({
        data: {
          longitude: co_ordinates.lng,
          latitude: co_ordinates.lat,
        },
      });

      return this.prisma.user.create({
        data: {
          ...userDetails,
          location: {
            connect: {
              id: location.id,
            },
          },
        },
      });
    } else {
      return {
        throw: new HttpException(
          'email already exists',
          HttpStatus.BAD_REQUEST,
        ),
      };
    }
  }

  async updateUser(id, userDetails: UserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const co_ordinates = await this.getLocation(userDetails);

    await this.prisma.location.update({
      where: { id: user.locationId },
      data: { longitude: co_ordinates.lng, latitude: co_ordinates.lat },
    });
    return this.prisma.user.update({
      where: { id },
      data: {
        ...userDetails,
      },
    });
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
}

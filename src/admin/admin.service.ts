import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminDto } from './Dto/admin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async adminLogin(adminDetails: AdminDto) {
    const admin = await this.prisma.admin.findFirst({
      where: { email: adminDetails.email },
    });
    if (!admin) {
      throw new UnauthorizedException('admin details not found');
    }
    // const pwMatches = await argorn.verify(
    //   adminDetails.password,
    //   admin.password,
    // );
    // if (!pwMatches) {
    //   throw new UnauthorizedException('email or password doesnot match');
    // }
    return { msg: `welcome ${admin.name}` };
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

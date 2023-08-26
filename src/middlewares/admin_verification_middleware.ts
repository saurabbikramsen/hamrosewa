import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminVerificationMiddleware implements NestMiddleware {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (req?.headers.authorization) {
        const token = req.headers.authorization;
        console.log(req.headers.authorization);
        const real_token = token.slice(7, token.length);

        const verify = this.jwtService.verify(real_token, {
          secret: this.config.get('ACCESS_TOKEN_SECRET'),
        });
        const user = await this.prisma.user.findFirst({
          where: { email: verify.email },
        });

        if (!user?.email && verify?.role != 'admin') {
          throw new HttpException(
            'you are not eligible to perform this task',
            HttpStatus.UNAUTHORIZED,
          );
        }
        next();
      } else {
        throw 'No token present';
      }
    } catch (err) {
      throw new HttpException({ err }, HttpStatus.UNAUTHORIZED);
    }
  }
}

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserAuthGuards implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      if (request?.headers.authorization) {
        const token = request.headers.authorization;
        console.log(request.headers.authorization);
        const real_token = token.slice(7, token.length);

        const verify = this.jwtService.verify(real_token, {
          secret: this.config.get('ACCESS_TOKEN_SECRET'),
        });
        const user = await this.prisma.user.findFirst({
          where: { email: verify.email },
        });

        if (!user?.email && verify?.role != 'user') {
          throw new HttpException(
            'you are not eligible to perform this task',
            HttpStatus.UNAUTHORIZED,
          );
        }
        return true;
      } else {
        throw 'No token present';
      }
    } catch (err) {
      throw new HttpException({ err }, HttpStatus.UNAUTHORIZED);
    }
    return false;
  }
}

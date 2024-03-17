import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { NextFunction, Response } from 'express';
import { Request } from '../types/request.type';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private authService: AuthService,
  ) {
  }

  async use(req: Request, _: Response, next: NextFunction) {
    const token = this.authService.extractTokenFromCookie(req);
    delete req.user;
    if (token) {
      try {
        req.user = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('JWT_SECRET'),
        });
      } catch (_) {
        // ignored
      }
    }

    next();
  }
}
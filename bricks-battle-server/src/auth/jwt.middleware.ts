import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { NextFunction, Response } from 'express';
import { Request } from '../types/request.type';
import { Types } from 'mongoose';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.authService.extractTokenFromCookie(req);

    delete req.user;
    if (token) {
      try {
        req.user = await this.jwtService.verifyAsync(token);

        // Convert sub to _id so that it can be used in mongoose queries
        if (req.user.sub)
          req.user._id = new Types.ObjectId(req.user.sub);
      } catch (_) {
        // ignored
      }
    }

    next();
  }
}
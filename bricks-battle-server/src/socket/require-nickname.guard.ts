import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../types/request.type';

/**
 * Its unused because socket should not be able to connect without setting a nickname first.
 */
@Injectable()
export class RequireNickname implements CanActivate {
  constructor(private readonly jwtService: JwtService) {
    // empty
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const cookies = parse(ctx.switchToWs().getClient().handshake.headers.cookie);

    if (!cookies.access_token) {
      throw new WsException('Unauthorized, you must enter a nickname first.');
    }

    const payload: TokenPayload = this.jwtService.decode(cookies.access_token);

    if (!payload.nickname) {
      throw new WsException('Unauthorized, you must enter a nickname first.');
    }

    return true;
  }
}
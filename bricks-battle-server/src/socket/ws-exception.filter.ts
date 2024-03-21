import { Catch, ExceptionFilter, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { SocketType } from '../game/game.types';
import { EventWsException } from './event-ws-exception';

@Catch(WsException)
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: WsException, ctx: ExecutionContext) {
    const client: SocketType = ctx.switchToWs().getClient();

    if (exception instanceof EventWsException)
      client.emit('event_exception', exception.getError().toString());
    else
      client.emit('exception', exception.getError().toString());
  }
}
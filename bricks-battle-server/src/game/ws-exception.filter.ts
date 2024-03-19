import { Catch, ExceptionFilter, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { SocketType } from './game.types';

@Catch(WsException)
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: WsException, ctx: ExecutionContext) {
    const client: SocketType = ctx.switchToWs().getClient();

    client.emit('exception', exception.getError().toString());

    return exception.getError();
  }
}
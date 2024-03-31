import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SocketType } from '../game/game.types';
import { WsException } from '@nestjs/websockets';


export const GameId = createParamDecorator(function(_: string, ctx: ExecutionContext) {
  const socket = ctx.switchToWs().getClient() as SocketType;

  const gameId = socket.data.gameId;

  if (!gameId) {
    throw new WsException('You are not in a game!');
  }

  return gameId;
});
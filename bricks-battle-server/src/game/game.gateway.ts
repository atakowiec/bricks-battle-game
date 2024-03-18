import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { SocketType } from './game.types';

@WebSocketGateway({ cors: true })
export class GameGateway {

  // This is a simple example of a message handler. Use SocketType to get the correct types for the client and the data.
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: SocketType): string {
    return data;
  }
}
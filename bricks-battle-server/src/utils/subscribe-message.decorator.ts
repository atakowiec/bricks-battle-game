import { SubscribeMessage } from '@nestjs/websockets';
import { ClientToServerEventsKeys } from '@shared/Socket';

export default SubscribeMessage<ClientToServerEventsKeys>;

import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';

@Module({
  controllers: [],
  providers: [GameService, GameGateway]
})
export class GameModule {}

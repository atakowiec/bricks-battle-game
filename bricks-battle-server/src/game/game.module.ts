import { forwardRef, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
    forwardRef(() => AuthModule),
  ],
  controllers: [],
  providers: [GameService, GameGateway],
  exports: [GameGateway]
})
export class GameModule {}

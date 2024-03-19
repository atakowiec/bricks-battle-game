import { forwardRef, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import {AuthModule} from "../auth/auth.module";
import { RequireNickname } from './require-nickname.guard';

@Module({
  imports: [
    forwardRef(() => AuthModule),
  ],
  controllers: [],
  providers: [GameService, GameGateway, RequireNickname],
  exports: [GameService]
})
export class GameModule {}

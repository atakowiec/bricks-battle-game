import { forwardRef, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import {AuthModule} from "../auth/auth.module";
import { RequireNickname } from '../socket/require-nickname.guard';
import { MapsModule } from '../maps/maps.module';
import { GadgetsModule } from '../gadgets/gadgets.module';

@Module({
  imports: [
    MapsModule,
    forwardRef(() => AuthModule),
    GadgetsModule
  ],
  controllers: [],
  providers: [GameService, GameGateway, RequireNickname],
  exports: [GameService]
})
export class GameModule {}

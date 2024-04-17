import { forwardRef, Module } from '@nestjs/common';
import { GadgetsService } from './gadgets.service';
import { GadgetsController } from './gadgets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Gadget, GadgetSchema } from './gadget.schema';
import { User, UserSchema } from '../users/user.schema';
import { SelectedGadget, SelectedGadgetSchema } from './selected-gadgets.schema';
import { GameModule } from '../game/game.module';

@Module({
  imports: [
    forwardRef(() => GameModule),
    MongooseModule.forFeature([
      { name: Gadget.name, schema: GadgetSchema },
      { name: User.name, schema: UserSchema },
      { name: SelectedGadget.name, schema: SelectedGadgetSchema },
    ])],
  providers: [GadgetsService],
  controllers: [GadgetsController],
  exports: [GadgetsService],
})
export class GadgetsModule {
  // empty
}

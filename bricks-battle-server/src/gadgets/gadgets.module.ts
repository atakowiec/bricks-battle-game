import { Module } from '@nestjs/common';
import { GadgetsService } from './gadgets.service';
import { GadgetsController } from './gadgets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Gadget, GadgetSchema } from './gadget.schema';
import { User, UserSchema } from '../users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Gadget.name, schema: GadgetSchema },
      { name: User.name, schema: UserSchema },
    ])],
  providers: [GadgetsService],
  controllers: [GadgetsController],
})
export class GadgetsModule {
  // empty
}
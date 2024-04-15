import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { DisplayType, GadgetType } from '@shared/Gadgets';

export class CreateGadgetDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['icon', 'paddle', 'ball', 'trails', 'barrier', 'effects'])
  type: GadgetType;

  @IsString()
  @IsNotEmpty()
  @IsIn(['image', 'color'])
  displayType: DisplayType;

  @IsString()
  @IsNotEmpty()
  data: string;
}
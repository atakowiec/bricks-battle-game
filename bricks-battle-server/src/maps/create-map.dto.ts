import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMapDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['easy', 'normal', 'hard'])
  difficulty: string;

  @IsString()
  @IsNotEmpty()
  data: string;

  @IsInt()
  @IsNotEmpty()
  size: number;
}
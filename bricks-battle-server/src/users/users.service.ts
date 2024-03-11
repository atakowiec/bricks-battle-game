import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    // empty
  }

  async create(createUseDto: CreateUserDto): Promise<User> {
    return await new this.userModel(createUseDto).save();
  }

  async findOne(nickname: string): Promise<User> {
    return this.userModel.findOne({ nickname });
  }
}

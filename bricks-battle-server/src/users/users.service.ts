import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    // empty
  }

  async create(createUseDto: CreateUserDto): Promise<User> {
    return await new this.userModel(createUseDto).save();
  }

  async findOne(filters: UpdateUserDto): Promise<User> {
    return this.userModel.findOne({ ...filters });
  }

  async getUserById(_id: string): Promise<User> {
    return this.userModel.findOne({_id: new Types.ObjectId(_id)});
  }
}

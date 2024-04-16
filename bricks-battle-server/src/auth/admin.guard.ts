import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from '../types/request.type';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    // empty
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.user?._id)
      throw new UnauthorizedException();

    const user = await this.userModel.findById(request.user._id);
    if (!user || !user.admin)
      throw new ForbiddenException("Insufficient permissions");

    return true;
  }
}
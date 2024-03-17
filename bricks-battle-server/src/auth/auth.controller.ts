import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { RequestUser } from '../users/request-user.decorator';
import { User } from '../users/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    // empty
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    return await this.authService.register(createUserDto, res);
  }

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    return await this.authService.login(createUserDto, res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @RequestUser() user: User) {
    return this.authService.changePassword(changePasswordDto, user);
  }

  @UseGuards(AuthGuard)
  @Post('verify')
  verify(@RequestUser() user: User) {
    return this.authService.verify(user);
  }
}

import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';

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
  async login(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response){
    return await this.authService.login(createUserDto, res);
  }
}

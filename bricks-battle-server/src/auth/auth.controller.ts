import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { RequestUser } from '../users/request-user.decorator';
import { SetNicknameDto } from './dto/set-nickname.dto';
import { TokenPayload } from '../types/request.type';
import { JwtGuard } from './jwt.guard';

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
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @RequestUser() user: TokenPayload) {
    return this.authService.changePassword(changePasswordDto, user);
  }

  @UseGuards(JwtGuard)
  @Post('verify')
  verify(@RequestUser() user: TokenPayload, @Res({passthrough: true}) response: Response) {
    return this.authService.verify(user, response);
  }

  @Post('nickname')
  async setNickname(@Body() { nickname }: SetNicknameDto, @Res({ passthrough: true }) response: Response) {
    return this.authService.setNickname(nickname, response);
  }
}

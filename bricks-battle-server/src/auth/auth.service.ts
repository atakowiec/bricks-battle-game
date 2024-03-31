import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { Request, TokenPayload } from '../types/request.type';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { GameService } from '../game/game.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly gameService: GameService,
  ) {
    // empty
  }

  async register(createUserDto: CreateUserDto, res: Response) {
    if (await this.usersService.findOne({ nickname: createUserDto.nickname })) {
      throw new HttpException('Username already exists', 409);
    }

    if (this.gameService.isUsernameConnected(createUserDto.nickname)) {
      throw new HttpException('User is already connected', 409);
    }

    createUserDto.password = await this.hashPassword(createUserDto.password);

    const user = await this.usersService.create(createUserDto);

    const payload: TokenPayload = { nickname: user.nickname, sub: user._id };
    const access_token = this.jwtService.sign(payload);
    AuthService.setCookie(res, access_token);

    return payload;
  }

  async login(createUserDto: CreateUserDto, res: Response) {
    const user = await this.usersService.findOne({ nickname: createUserDto.nickname });

    if (!user || !(await this.comparePasswords(createUserDto.password, user.password))) {
      throw new HttpException('Invalid credentials', 401);
    }

    if (this.gameService.isUsernameConnected(user.nickname)) {
      throw new HttpException('User is already connected', 409);
    }

    const payload: TokenPayload = { nickname: user.nickname, sub: user._id };
    const access_token = this.jwtService.sign(payload);
    AuthService.setCookie(res, access_token);

    return payload;
  }

  public static setCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
      httpOnly: true,
      secure: false,
    });
  }

  public static clearCookie(res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
    });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  extractTokenFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    return null;
  }

  async logout(res: Response) {
    res.clearCookie('access_token');
    return {};
  }

  async changePassword(changePasswordDto: ChangePasswordDto, user: any) {
    user = await this.usersService.findOne({ _id: user._id });

    if (!user || !await this.comparePasswords(changePasswordDto.oldPassword, user.password)) {
      throw new HttpException('Invalid credentials', 401);
    }

    user.password = await this.hashPassword(changePasswordDto.newPassword);

    user.save();

    return { 'status': 'ok' };
  }

  async verify(user: TokenPayload, response: Response) {
    if (this.gameService.isUsernameConnected(user.nickname)) {
      AuthService.clearCookie(response);
      throw new HttpException('User is already connected', 409);
    }

    // if user wants to use nickname without being logged in - check if it's available
    if (!user.sub) {
      const dbUser = await this.usersService.findOne({ nickname: user.nickname });

      // do not allow to use nickname that is already taken by logged user
      if (dbUser) {
        AuthService.clearCookie(response);
        throw new HttpException('Nickname already exists', 409);
      }
    } else {
      // if user is logged in - check if account exists
      const dbUser = await this.usersService.getUserById(user.sub);

      if (!dbUser) {
        AuthService.clearCookie(response);
        throw new HttpException('User not found', 404);
      }
    }

    // allow to use nickname if it's not taken by anyone

    AuthService.setCookie(response, this.jwtService.sign({
      nickname: user.nickname,
      sub: user.sub,
    } as TokenPayload));

    return user;
  }

  async setNickname(nickname: string, response: Response) {
    const user = await this.usersService.findOne({ nickname });

    if (user || this.gameService.isUsernameConnected(nickname)) {
      throw new HttpException('Nickname already exists', 409);
    }

    const access_token = this.jwtService.sign({ nickname });
    AuthService.setCookie(response, access_token);

    return { nickname };
  }
}

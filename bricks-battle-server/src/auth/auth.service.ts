import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    // empty
  }

  async register(createUserDto: CreateUserDto, res: Response) {
    if (await this.usersService.findOne(createUserDto.nickname)) {
      throw new HttpException('Username already exists', 409);
    }

    createUserDto.password = await this.hashPassword(createUserDto.password);

    const user = await this.usersService.create(createUserDto);

    const payload = { nickname: user.nickname, sub: user._id };
    const access_token = this.jwtService.sign(payload);
    this.setCookie(res, access_token);

    return payload;
  }

  async login(createUserDto: CreateUserDto, res: Response) {
    const user = await this.usersService.findOne(createUserDto.nickname);

    if (!user || !(await this.comparePasswords(createUserDto.password, user.password))) {
      throw new HttpException('Invalid credentials', 401);
    }

    const payload = { nickname: user.nickname, sub: user._id };
    const access_token = this.jwtService.sign(payload);
    this.setCookie(res, access_token);

    return payload;
  }

  setCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
      httpOnly: true,
      secure: false,
    });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // You can adjust the salt rounds according to your requirements
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
}

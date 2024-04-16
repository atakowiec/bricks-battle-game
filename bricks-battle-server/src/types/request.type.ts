import * as Express from 'express';
import { Types } from 'mongoose';

export interface Request extends Express.Request {
  user?: TokenPayload;
  cookies: {
    [key: string]: string;
  }
}

export interface TokenPayload {
  nickname: string;
  _id?: Types.ObjectId;
  sub?: string;
  admin?: boolean;
}
import * as Express from 'express';

export interface Request extends Express.Request {
  user?: any;
  cookies: {
    [key: string]: string;
  }
}
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface CustomRequest extends Request {
  token: { userId: string; email: string } | JwtPayload;
}

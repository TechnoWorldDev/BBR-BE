import { Request } from 'express';

export interface CustomRequest extends Request {
  abacRules?: any;
  user?: any;
}

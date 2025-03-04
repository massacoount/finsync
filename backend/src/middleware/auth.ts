import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import { ParsedQs } from 'qs';
import config from '../config';
const authMiddleware: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>> = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(new Error('No token provided'));
  const token = authHeader.split(' ')[1];
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    (req as any).user = decoded;
    next();
  });
};
export default authMiddleware;

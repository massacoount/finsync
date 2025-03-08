import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

class AuthMiddleware {
  public static authenticate: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(new Error('No token provided'));
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      (req as any).user = decoded;
      next();
    });
  };
}

export default AuthMiddleware;

import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../config/db';
import config from '../config';
import logger from '../config/logger';

export const login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    const users = rows as any[];
    if (users.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const user = users[0];
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign({ id: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });
    res.json({ token });
    return;
  } catch (error: any) {
    res.status(500).json({error : "Some error occurred"});
    logger.error(error);
    return;
  }
};

export const protectedRoute: RequestHandler  = (req: Request, res: Response) => {
  res.json({ message: 'This is a protected route', user: (req as any).user });
};

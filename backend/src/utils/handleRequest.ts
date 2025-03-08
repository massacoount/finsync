import { NextFunction, Request, Response } from "express";

export const handleRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
  serviceMethod: (...args: any[]) => Promise<any>,
  ...args: any[]
): Promise<void> => {
  try {
    const result = await serviceMethod(...args);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

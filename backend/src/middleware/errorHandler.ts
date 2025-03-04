import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  if (req.accepts('html')) {
    res.type('html').send('<h1>404 - Not Found</h1><p>The requested resource could not be found.</p>');
  } else if (req.accepts('json')) {
    res.json({ error: 'Not Found' });
  } else {
    res.type('txt').send('Not Found');
  }
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500);
  if (req.accepts('html')) {
    res.type('html').send('<h1>500 - Internal Server Error</h1><p>Something went wrong on our end.</p>');
  } else if (req.accepts('json')) {
    res.json({ error: 'Internal Server Error' });
  } else {
    res.type('txt').send('Internal Server Error');
  }
};

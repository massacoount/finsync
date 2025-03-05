#!/bin/bash

# Set project name
PROJECT_NAME="backend"
mkdir $PROJECT_NAME && cd $PROJECT_NAME

# Initialize npm project
npm init -y

# Install production dependencies
npm install express mysql2 dotenv jsonwebtoken bcryptjs cors body-parser winston express-async-errors helmet

# Install dev dependencies including TypeScript, testing and type definitions
npm install --save-dev typescript ts-node nodemon eslint @types/express @types/node @types/jsonwebtoken @types/bcryptjs @types/cors @types/helmet jest ts-jest @types/jest

# Create tsconfig.json for TypeScript configuration
cat <<EOL > tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
EOL

# Create Jest configuration file (jest.config.js)
cat <<EOL > jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
};
EOL

# Create folder structure
mkdir -p src/{config,controllers,models,routes,middleware,services,tests}
mkdir logs

# Create .env file for environment configuration
cat <<EOL > .env
NODE_ENV=development
PORT=3000
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
EOL

# Create configuration loader (src/config/index.ts)
cat <<EOL > src/config/index.ts
import dotenv from 'dotenv';
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    connectionLimit: 10
  },
  jwtSecret: process.env.JWT_SECRET as string,
};

export default config;
EOL

# Create MySQL connection pool (src/config/db.ts)
cat <<EOL > src/config/db.ts
import mysql from 'mysql2/promise';
import config from './index';

const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: config.db.connectionLimit,
  queueLimit: 0
});

export default pool;
EOL

# Set up centralized logging using Winston (src/config/logger.ts)
cat <<EOL > src/config/logger.ts
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return \`\${timestamp} [\${level}]: \${message}\`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    colorize(),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/app.log' })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ]
});

export default logger;
EOL

# Create authentication controller (src/controllers/authController.ts)
cat <<EOL > src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../config/db';
import config from '../config';
import logger from '../config/logger';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    const users = rows as any[];
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = users[0];
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error: any) {
    logger.error(\`Login error: \${error.message}\`);
    next(error);
  }
};

export const protectedRoute = (req: Request, res: Response) => {
  res.json({ message: 'This is a protected route', user: (req as any).user });
};
EOL

# Create JWT authentication middleware (src/middleware/auth.ts)
cat <<EOL > src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    (req as any).user = decoded;
    next();
  });
};
EOL

# Create authentication routes with standardized endpoint paths (src/routes/auth.ts)
cat <<EOL > src/routes/auth.ts
import { Router } from 'express';
import { login, protectedRoute } from '../controllers/authController';
import authMiddleware from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.get('/protected', authMiddleware, protectedRoute);

export default router;
EOL

# Create error handling middleware for content-aware responses (src/middleware/errorHandler.ts)
cat <<EOL > src/middleware/errorHandler.ts
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
EOL

# Create main Express app with standardized endpoints and error pages (src/app.ts)
cat <<EOL > src/app.ts
import 'express-async-errors';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import config from './config';
import logger from './config/logger';
import authRoutes from './routes/auth';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(bodyParser.json());

// Standardized endpoints with versioning (e.g., /api/v1)
app.use('/api/v1/auth', authRoutes);

// Additional endpoints can be added here using the same standard format

// Catch-all for 404 Not Found
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
EOL

# Create server entry point (src/index.ts)
cat <<EOL > src/index.ts
import app from './app';
import config from './config';
import logger from './config/logger';

const server = app.listen(config.port, () => {
  logger.info(\`Server running on port \${config.port} in \${config.env} mode\`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Closing server.');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
EOL

# Create PM2 ecosystem configuration file (ecosystem.config.js)
cat <<EOL > ecosystem.config.js
module.exports = {
  apps: [{
    name: 'backend',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
EOL

# Create ESLint configuration file (.eslintrc.json)
cat <<EOL > .eslintrc.json
{
  "env": {
    "node": true,
    "es2021": true,
    "jest": true
  },
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "no-unused-vars": "warn",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "no-console": "off"
  }
}
EOL

# Create a SQL script to set up the initial users table (setup.sql)
cat <<EOL > setup.sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOL

# Create a sample test file for the API (src/tests/app.test.ts)
cat <<EOL > src/tests/app.test.ts
import request from 'supertest';
import app from '../app';

describe('GET /nonexistent', () => {
  it('should return 404 with JSON response', async () => {
    const res = await request(app).get('/nonexistent').set('Accept', 'application/json');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Not Found');
  });

  it('should return 404 with HTML response', async () => {
    const res = await request(app).get('/nonexistent').set('Accept', 'text/html');
    expect(res.status).toBe(404);
    expect(res.text).toContain('404 - Not Found');
  });
});
EOL

# Install Supertest for HTTP assertions in tests
npm install --

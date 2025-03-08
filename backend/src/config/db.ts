import mysql from 'mysql2/promise';
import config from './index';
import fs from 'fs/promises'; 

const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: config.db.connectionLimit,
  queueLimit: 0
});

export const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    // Read and execute the setup script
    const setupScript = await fs.readFile('../../sql/setup.sql', 'utf-8');
    await connection.query(setupScript);
    console.log('Database schema created successfully');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export default pool;

import mysql from 'mysql2/promise';

export default class DatabaseService {
  constructor(logger) {
    this.logger = logger;
    this.logger.debug('Initializing DatabaseService');
    this.logger.error("Config", process.env);
    this.pool = mysql.createPool({
      host: process.env.FINSYNC_DB_HOST,
      port: process.env.FINSYNC_DB_PORT,
      user: process.env.FINSYNC_DB_USER,
      password: process.env.FINSYNC_DB_PASSWORD,
      database: process.env.FINSYNC_DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async query(sql, params) {
    try {
      const [results] = await this.pool.execute(sql, params);
      return results;
    } catch (error) {
      this.logger.error('Database query error:', { sql, error: error.message });
      throw error;
    }
  }

  async getConnection() {
    try {
      const connection = await this.pool.getConnection();
      return connection;
    } catch (error) {
      this.logger.error('Database connection error:', error);
      throw error;
    }
  }
}
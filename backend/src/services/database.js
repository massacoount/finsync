const mysql = require("mysql");

class DatabaseService {
  constructor(logger) {
    this.logger = logger;
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  query(sql, params) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, params, (error, results) => {
        if (error) {
          this.logger.error("Database query error:", error);
          reject(error);
        } else {
          this.logger.info("Query successful:", sql);
          resolve(results);
        }
      });
    });
  }

  getConnection() {
    return new Promise((resolve, reject) => {
      this.connection.connect((err) => {
        if (err) {
          this.logger.error("Database connection error:", err);
          reject(err);
        } else {
          this.logger.info("Connected to the database!");
          resolve(this.connection);
        }
      });
    });
  }
}

module.exports = DatabaseService;

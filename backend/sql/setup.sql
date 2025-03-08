-- Create oauth_clients table
CREATE TABLE IF NOT EXISTS oauth_clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id VARCHAR(255) NOT NULL UNIQUE,
  client_secret VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  picture VARCHAR(255),
  provider ENUM('LOCAL', 'MICROSOFT', 'GOOGLE', 'GITHUB') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  notes TEXT
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  account_type ENUM('checking', 'savings', 'credit', 'investment') NOT NULL,
  description TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  date DATETIME NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  account_from VARCHAR(255),
  account_to VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Create journals table
CREATE TABLE IF NOT EXISTS journals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  transaction_id INT NOT NULL,
  date DATETIME NOT NULL,
  journal_entry TEXT,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

-- Create budget_targets table
CREATE TABLE IF NOT EXISTS budget_targets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT NOT NULL,
  monthly_target DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
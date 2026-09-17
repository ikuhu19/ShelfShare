-- ShelfShare Database Schema
CREATE DATABASE IF NOT EXISTS shelfshare;
USE shelfshare;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  college VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books Table
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  book_condition ENUM('New', 'Good', 'Fair') DEFAULT 'Good',
  description TEXT,
  image VARCHAR(255),
  availability TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Exchange Requests Table
CREATE TABLE IF NOT EXISTS exchange_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  requester_id INT NOT NULL,
  status ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Drop the database if it exists
DROP DATABASE IF EXISTS expense_tracker;

-- Create a new database called expense_tracker
CREATE DATABASE expense_tracker;
USE expense_tracker;

-- Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    dob DATE NOT NULL
);

-- Create the expenses table with a foreign key reference to the users table
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    category VARCHAR(255),
    amount DECIMAL(10, 2),
    date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the login_history table with a foreign key reference to the users table
CREATE TABLE login_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    username VARCHAR(255),
    first_name VARCHAR(255),
    login_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the incomes table with a foreign key reference to the users table
CREATE TABLE incomes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    source VARCHAR(255),      -- Category for the income, similar to the expenses table
    amount DECIMAL(10, 2),      -- Amount of the income
    date DATE,                  -- Date of the income
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the expense_each_category table
CREATE TABLE expense_each_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(255) NOT NULl,          
    total_expense DECIMAL(10, 2) DEFAULT 0.00
);

-- Create the income_per_source table
CREATE TABLE income_per_source (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source VARCHAR(255) NOT NULL,           
    total_income DECIMAL(10, 2) DEFAULT 0.00
);
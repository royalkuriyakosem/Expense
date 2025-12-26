-- Drop the tables if they exist
DROP TABLE IF EXISTS income_per_source;
DROP TABLE IF EXISTS expense_each_category;
DROP TABLE IF EXISTS incomes;
DROP TABLE IF EXISTS login_history;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS users;

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
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
    id SERIAL PRIMARY KEY,
    user_id INT,
    category VARCHAR(255),
    amount DECIMAL(10, 2),
    date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the login_history table with a foreign key reference to the users table
CREATE TABLE login_history (
    id SERIAL PRIMARY KEY,
    user_id INT,
    username VARCHAR(255),
    first_name VARCHAR(255),
    login_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the incomes table with a foreign key reference to the users table
CREATE TABLE incomes (
    id SERIAL PRIMARY KEY,
    user_id INT,
    source VARCHAR(255),      -- Category for the income, similar to the expenses table
    amount DECIMAL(10, 2),      -- Amount of the income
    date DATE,                  -- Date of the income
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the expense_each_category table
CREATE TABLE expense_each_category (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL,          
    total_expense DECIMAL(10, 2) DEFAULT 0.00
);

-- Create the income_per_source table
CREATE TABLE income_per_source (
    id SERIAL PRIMARY KEY,
    source VARCHAR(255) NOT NULL,           
    total_income DECIMAL(10, 2) DEFAULT 0.00
);
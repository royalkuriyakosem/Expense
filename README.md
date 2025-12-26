# Expense Management Application

A web-based application to efficiently track and manage your daily income and expenses. Built with Node.js, Express, and MySQL.

## Features

-   **User Authentication**: Secure signup and login functionality.
-   **Dashboard**: View total income, total expenses, and savings at a glance.
-   **Income & Expense Tracking**: Add, view, and delete income and expense entries.
-   **Categorization**: Organize finances by category for better insights.
-   **Reports**: View category-wise breakdowns of your finances.

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: MySQL
-   **Templating**: EJS
-   **Styling**: CSS (Custom)
-   **Utilities**: `dotenv` (Configuration), `morgan` (Logging), `bcryptjs` (Security)

## Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [MySQL](https://www.mysql.com/)

## Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/royalkuriyakosem/Expense.git
    cd Expense
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Database Setup**:
    -   Log in to your MySQL server:
        ```bash
        mysql -u root -p
        ```
    -   Run the schema script to create the database and tables:
        ```sql
        SOURCE schema/schema.sql;
        ```
    -   (Optional) Insert sample data:
        ```sql
        SOURCE schema/insert.sql;
        ```

4.  **Configuration**:
    -   Create a `.env` file in the root directory (copy from `.env.example`):
        ```bash
        cp .env.example .env
        ```
    -   Open `.env` and update your database credentials and session secret:
        ```env
        DB_HOST=localhost
        DB_USER=root
        DB_PASS=your_password
        DB_NAME=expense_tracker
        SESSION_SECRET=your_secure_secret
        PORT=3000
        ```

5.  **Run the Application**:
    -   **Development Mode** (with auto-restart):
        ```bash
        npm run dev
        ```
    -   **Production Mode**:
        ```bash
        npm start
        ```

6.  **Access the App**:
    -   Open your browser and navigate to `http://localhost:3000`.

## Project Structure

-   `app.js`: Main application entry point.
-   `config/`: Database configuration.
-   `public/`: Static assets (CSS, images).
-   `routes/`: (If applicable) Route definitions.
-   `schema/`: SQL scripts for database setup.
-   `views/`: EJS templates for the UI.

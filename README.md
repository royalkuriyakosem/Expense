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
-   **Database**: PostgreSQL (Supabase)
-   **Templating**: EJS
-   **Styling**: CSS (Custom)
-   **Utilities**: `dotenv` (Configuration), `morgan` (Logging), `bcryptjs` (Security)

## Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [PostgreSQL](https://www.postgresql.org/) (or use Supabase)

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
    -   Create a project on [Supabase](https://supabase.com/).
    -   Get your connection string (Transaction Mode is recommended for serverless).
    -   Run the setup script to create tables:
        ```bash
        node scripts/setup_db.js
        ```
    -   (Optional) Seed dummy data:
        ```bash
        node scripts/seed_data.js
        ```

4.  **Configuration**:
    -   Create a `.env` file in the root directory:
        ```bash
        cp .env.example .env
        ```
    -   Update `.env` with your credentials:
        ```env
        DATABASE_URL=postgresql://user:password@host:port/database
        SESSION_SECRET=your_secure_secret
        PORT=3000
        ```

5.  **Run the Application**:
    -   **Development Mode**:
        ```bash
        npm run dev
        ```
    -   **Production Mode**:
        ```bash
        npm start
        ```

6.  **Access the App**:
    -   Open your browser and navigate to `http://localhost:3000`.

## Deployment (Render)

1.  Create a new **Web Service** on [Render](https://render.com/).
2.  Connect your GitHub repository.
3.  Render will automatically detect the configuration from `render.yaml`.
4.  **Important**: You must manually add your environment variables in the Render Dashboard:
    -   `DATABASE_URL`: Your Supabase connection string.
    -   `SESSION_SECRET`: A secure random string.
5.  Click **Create Web Service**.

## Project Structure

-   `app.js`: Main application entry point.
-   `config/`: Database configuration.
-   `public/`: Static assets (CSS, images).
-   `routes/`: (If applicable) Route definitions.
-   `schema/`: SQL scripts for database setup.
-   `views/`: EJS templates for the UI.

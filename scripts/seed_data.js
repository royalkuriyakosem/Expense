const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function seedData() {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();

        // 1. Create a Demo User
        console.log('Creating demo user...');
        const userInsert = `
            INSERT INTO users (first_name, middle_name, last_name, email, username, password, dob)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id;
        `;
        const userValues = ['John', 'D.', 'Doe', 'john.doe@example.com', 'demo', 'password123', '1990-01-01'];

        // Handle potential duplicate user
        let userId;
        try {
            const res = await client.query(userInsert, userValues);
            userId = res.rows[0].id;
            console.log(`User created with ID: ${userId}`);
        } catch (err) {
            if (err.code === '23505') { // Unique violation
                console.log('User already exists, fetching ID...');
                const res = await client.query('SELECT id FROM users WHERE username = $1', ['demo']);
                userId = res.rows[0].id;
            } else {
                throw err;
            }
        }

        // 2. Add Incomes
        console.log('Adding incomes...');
        const incomeQuery = 'INSERT INTO incomes (user_id, source, amount, date) VALUES ($1, $2, $3, $4)';
        await client.query(incomeQuery, [userId, 'Salary', 5000.00, '2023-10-01']);
        await client.query(incomeQuery, [userId, 'Freelance', 1200.50, '2023-10-15']);
        await client.query(incomeQuery, [userId, 'Bonus', 500.00, '2023-10-25']);

        // 3. Add Expenses
        console.log('Adding expenses...');
        const expenseQuery = 'INSERT INTO expenses (user_id, category, amount, date) VALUES ($1, $2, $3, $4)';
        await client.query(expenseQuery, [userId, 'Rent', 1200.00, '2023-10-02']);
        await client.query(expenseQuery, [userId, 'Groceries', 150.75, '2023-10-05']);
        await client.query(expenseQuery, [userId, 'Utilities', 100.00, '2023-10-10']);
        await client.query(expenseQuery, [userId, 'Transport', 50.00, '2023-10-12']);
        await client.query(expenseQuery, [userId, 'Dining Out', 80.00, '2023-10-20']);

        console.log('Dummy data seeded successfully!');
        client.release();
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        await pool.end();
    }
}

seedData();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./config/db');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true
}));

// Middleware to protect routes
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
}

// Home Route (Protected)
// Home Route (Protected)
app.get('/', requireLogin, async (req, res) => {
    try {
        // Get the user's first name
        const [user] = await db.query('SELECT first_name FROM users WHERE id = ?', [req.session.userId]);
        const name = user.length > 0 ? user[0].first_name : 'Guest'; // Default to 'Guest' if no user found
        
        // Query to get the total income
        const [incomeResult] = await db.query(
            'SELECT IFNULL(SUM(amount), 0) AS total_income FROM incomes WHERE user_id = ?',
            [req.session.userId]
        );
        const totalIncome = parseFloat(incomeResult[0].total_income) || 0;

        // Query to get the total expenses
        const [expenseResult] = await db.query(
            'SELECT IFNULL(SUM(amount), 0) AS total_expense FROM expenses WHERE user_id = ?',
            [req.session.userId]
        );
        const totalExpense = parseFloat(expenseResult[0].total_expense) || 0;

        // Calculate savings
        const savings = totalIncome - totalExpense;

        // Pass totals and user name to the home view
        res.render('home', { totalIncome, totalExpense, savings, name }); // Use 'name' instead of 'Name'
    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
});


// Signup Route
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    const { firstName, middleName, lastName, email, username, dob, password, confirmPassword } = req.body;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        console.error("Passwords do not match.");
        return res.redirect('/signup'); // Handle password mismatch
    }

    try {
        await db.query(
            'INSERT INTO users (first_name, middle_name, last_name, email, username, dob, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [firstName, middleName || null, lastName, email, username, dob, password]
        );
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.redirect('/signup'); // Handle errors (e.g., duplicate email or username)
    }
});

// Login Route
app.get('/login', (req, res) => {
    res.render('login', { error: null }); // No error initially
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length > 0) {
            const user = users[0];
            if (password === user.password) {
                req.session.userId = user.id;  // Store user ID in session
                return res.redirect('/'); // Redirect to home after login
            }
        }
        // If credentials are incorrect, set error message
        res.render('login', { error: 'Invalid username or password. Please try again.' });
    } catch (error) {
        console.error(error);
        res.render('login', { error: 'An error occurred. Please try again.' });
    }
});


// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/login');
    });
});

// Incomes Route (Protected)
app.get('/incomes', requireLogin, async (req, res) => {
    try {
        const [incomes] = await db.query('SELECT * FROM incomes WHERE user_id = ?', [req.session.userId]);
        res.render('incomes', { incomes }); // Render the incomes view
    } catch (error) {
        console.error(error);
    }
});

// Expenses Route (Protected)
app.get('/expenses', requireLogin, async (req, res) => {
    try {
        const [expenses] = await db.query('SELECT * FROM expenses WHERE user_id = ?', [req.session.userId]);
        res.render('expenses', { expenses }); // Render the expenses view
    } catch (error) {
        console.error(error);
    }
});

// Add Expense Route (Protected)
app.get('/add-expense', requireLogin, (req, res) => {
    res.render('add-expense');
});

app.post('/add-expense', requireLogin, async (req, res) => {
    const { category, amount, date } = req.body;
    try {
        // Insert the expense with the user_id
        await db.query('INSERT INTO expenses (user_id, category, amount, date) VALUES (?, ?, ?, ?)', 
            [req.session.userId, category, amount, date]);
        res.redirect('/expenses'); // Redirect to expenses view after adding
    } catch (error) {
        console.error(error);
    }
});

// Add Income Route (Protected)
app.get('/add-income', requireLogin, (req, res) => {
    res.render('add-income');
});

app.post('/add-income', requireLogin, async (req, res) => {
    const { source, amount, date } = req.body;
    try {
        // Insert the income with the user_id
        await db.query('INSERT INTO incomes (user_id, source, amount, date) VALUES (?, ?, ?, ?)', 
            [req.session.userId, source, amount, date]);
        res.redirect('/incomes'); // Redirect to incomes view after adding
    } catch (error) {
        console.error(error);
    }
});

// Delete Expense Route
app.post('/delete-expense/:id', requireLogin, async (req, res) => {
    const expenseId = req.params.id;

    try {
        await db.query('DELETE FROM expenses WHERE id = ?', [expenseId]);
        res.redirect('/expenses'); // Redirect back to the expenses page after deletion
    } catch (error) {
        console.error(error);
        res.redirect('/expenses'); // Handle error and redirect
    }
});

//Delete Income Route
app.post('/delete-income/:id', requireLogin, async (req, res) => {
    const incomeId = req.params.id;

    try {
        await db.query('DELETE FROM incomes WHERE id = ?', [incomeId]);
        res.redirect('/incomes'); // Redirect back to the incomes page after deletion
    } catch (error) {
        console.error(error);
    }
});

// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));

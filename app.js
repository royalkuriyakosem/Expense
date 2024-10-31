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
app.get('/', requireLogin, async (req, res) => {
    try {
        // Fetch expenses for the logged-in user
        const [expenses] = await db.query('SELECT * FROM expenses WHERE user_id = ?', [req.session.userId]);
        res.render('index', { expenses });
    } catch (error) {
        console.error(error);
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
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length > 0) {
            const user = users[0];
            if (password === user.password) {
                req.session.userId = user.id;  // Store user ID in session

                // Insert login history record
                await db.query(
                    'INSERT INTO login_history (user_id, username, first_name) VALUES (?, ?, ?)',
                    [user.id, user.username, user.first_name]
                );

                return res.redirect('/');
            }
        }
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.redirect('/login');
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

// Add Expense Route (Protected)
app.get('/add-expense', requireLogin, (req, res) => {
    res.render('add-expense');
});

app.post('/add-expense', requireLogin, async (req, res) => {
    const { description, amount, date } = req.body;
    try {
        // Insert the expense with the user_id
        await db.query('INSERT INTO expenses (user_id, description, amount, date) VALUES (?, ?, ?, ?)', 
            [req.session.userId, description, amount, date]);
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

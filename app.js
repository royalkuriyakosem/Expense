const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
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
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.redirect('/signup');
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
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.userId = user.id;  // Store user ID in session
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

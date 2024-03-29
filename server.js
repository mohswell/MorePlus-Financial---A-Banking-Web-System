const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { createAccount, makeTransaction, getAccountInformation } = require('./services/bankingService');
const PORT = process.env.PORT || 3000;
const sequelize = require('./sequelize');
const User = require('./models/user');

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Synchronize models with the database
sequelize.sync()
    .then(() => {
        console.log('Database synced successfully.');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
});

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login/index');
});

// Render the registration page
app.get('/register', (req, res) => {
    res.render('register/register');
});

// Handle registration form submission
app.post('/register/process', async (req, res) => {
    const { first_name, last_name, birthday, gender, email, phone, password, subject } = req.body;
    if (!email || !password) {
        // Handle empty email or password
        res.status(400).send('Email and password are required');
        return;
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).send('User already exists');
            return;
        }

        // Hash the password
        const passwordHash = bcrypt.hashSync(password, 10);

        // Create the user in the database
        await User.create({ first_name, last_name, birthday, gender, email, phone, password: passwordHash, subject });
        res.redirect('/login'); // Redirect to the login page after successful registration
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Error creating user');
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, pass } = req.body;
    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (user) {
            // Compare the password hash
            if (bcrypt.compareSync(pass, user.password)) {
                // Passwords match, set session user and redirect
                req.session.user = user;
                res.redirect('/dashboard');
                return;
            }
        }
        // Either user doesn't exist or passwords don't match
        res.redirect('/login');
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Error logging in');
    }
});

// Dashboard route
app.get('/dashboard/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const accountInfo = await getAccountInformation(userId);
        res.render('dashboard', { user: accountInfo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create account route
app.post('/accounts', async (req, res) => {
    const { userId, accountNumber } = req.body;
    try {
        const account = await createAccount(userId, accountNumber);
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Make transaction route
app.post('/transactions', async (req, res) => {
    const { userId, accountId, amount, description, type } = req.body;
    try {
        const transaction = await makeTransaction(userId, accountId, amount, description, type);
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get account information route
app.get('/accounts/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const accountInfo = await getAccountInformation(userId);
        res.json(accountInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const insertUser = require('../src/api/user_create');
const path = require('path');
const user_login = require('../src/api/user_login'); // Adjust the path based on your file structure

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Render login page
app.get('/login', (req, res) => {
    res.render(path.join(__dirname, '../view', 'login.ejs'));
});

// Render homepage
app.get('/', (req, res) => {
    res.render(path.join(__dirname, '../view', 'index.ejs'));
});

// Create user endpoint
app.post('/create_user', (req, res) => {
    const customer = req.body;
    insertUser(customer, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Customer created successfully', customer: result });
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    user_login(username, password, (error, success, role) => {
        if (error) {
            res.status(500).send('Internal Server Error');
            return;
        }
          console.log('Login attempt:', { success, role }); // Log the values of success and role
        if (success) {
            switch (role) {
                case 'patient':
                    res.redirect('/patient');
                    break;
                case 'doctor':
                    res.redirect('/doctor');
                    break;
                default:
                    res.status(403).send('Unauthorized access');
            }
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
});

app.get('/patient', (req, res) => {
});

app.get('/secretary', (req, res) => {
});

app.get('/doctor', (req, res) => {
    res.render(path.join(__dirname, '../view/doctor','doctor_dashboard.ejs'));
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

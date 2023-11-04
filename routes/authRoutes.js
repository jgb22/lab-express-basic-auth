const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import the User model

const router = express.Router();

// Route to render the login form
router.get('/login', (req, res) => {
    res.render('login'); // Render the login form view (create this view using your templating engine)
});

// Route to handle login form submission
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Check if the entered password matches the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send('Invalid password');
        }

        // If credentials are correct, create a session for the user
        req.session.user = user;
        res.redirect('/dashboard'); // Redirect to the user's dashboard or a secured page
    } catch (error) {
        res.status(500).send('Error in login');
    }
});

module.exports = router;

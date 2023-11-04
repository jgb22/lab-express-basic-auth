// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

const bcrypt = require('bcryptjs');

const session = require('express-session');
const MongoStore = require('connect-mongo');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);


app.get('/signup', (req, res) => {
    res.render('signup'); // Render the signup form view (create this view using your templating engine)
  });
  
  // Create a route for handling the signup form submission
  app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if the username already exists in the database
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).send('Username already exists');
      }
  
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user in the database
      const newUser = new User({
        username,
        password: hashedPassword,
      });
      await newUser.save();
  
      res.redirect('/login'); // Redirect to the login page
    } catch (error) {
      res.status(500).send('Error in signup');
    }
  });

  app.use(session({
    secret: 'your_secret_key', // Use a strong secret key for production
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://your-db-connection' }), // Replace with your MongoDB connection
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
        secure: false // Set it to true if using HTTPS
    }
}));


module.exports = app;


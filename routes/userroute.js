const express = require('express');
const userRoute = express();
const session = require('express-session');
const config = require('../config/config');
const auth = require('../middleware/auth');
const usercontrollers = require('../controllers/usercontrollers');

// Configure session middleware
userRoute.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}));

// Parse JSON and URL-encoded data
userRoute.use(express.json());
userRoute.use(express.urlencoded({ extended: true }));

// Set the view engine and views directory
userRoute.set('view engine', 'ejs');
userRoute.set('views', './views');

// Route for user registration
userRoute.get('/signup', auth.isLogout, usercontrollers.loadRegister);
userRoute.post('/signup', usercontrollers.insertUser);

// Routes for user login
userRoute.get('/', auth.isLogout, usercontrollers.loginLoad);
userRoute.get('/login', auth.isLogout, usercontrollers.loginLoad);
userRoute.post('/login',usercontrollers.verifyLogin);

// Route for the user's home page
userRoute.get('/home', auth.isLogin, usercontrollers.loadHome);

// Route for user logout
userRoute.get('/logout', auth.isLogin, usercontrollers.userLogout);

module.exports = userRoute;

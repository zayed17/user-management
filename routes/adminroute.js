const express = require('express');
const adminRoute = express();
const session = require('express-session');
const config = require('../config/config');
const adminController = require('../controllers/admincontrollers');
const auth = require('../middleware/adminauth');
const nocache = require('nocache');


// Configure session middleware
adminRoute.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}));

// Parse JSON and URL-encoded data
adminRoute.use(express.json());
adminRoute.use(express.urlencoded({ extended: true }));

// Set the view engine and views directory
adminRoute.set('view engine', 'ejs');
adminRoute.set('views', './views/admin');

adminRoute.use(nocache());


// Route for the login page
adminRoute.get('/', auth.isLogout, adminController.LoadLogin);

// Route to handle the login form submission
adminRoute.post('/', adminController.verifyLogin);

// Route for the admin home page
adminRoute.get('/home', auth.isLogin, adminController.home);

// Route for logging out
adminRoute.get('/logout', auth.isLogin, adminController.logout);

// Route for the signup page
adminRoute.get('/signup', auth.isLogout, adminController.signup);
adminRoute.post('/signup', adminController.insertAdmin);

// Route for adding a user
adminRoute.get('/adduser', auth.isLogin, adminController.adduser);
adminRoute.post('/adduser', adminController.insertuser);

// Route for editing a user
adminRoute.get('/edituser', auth.isLogin, adminController.edituser);
adminRoute.post('/edituser', adminController.updateuser);

// Route for deleting a user
adminRoute.get('/deleteuser', adminController.deleteuser);

// Default route to redirect to the admin login page
adminRoute.get('*', (req, res) => {
    res.redirect('/admin');
});

module.exports = adminRoute;

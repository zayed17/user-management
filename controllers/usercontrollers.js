const User = require('../models/usermodel');
const bcrypt = require('bcrypt');

// Function to securely hash a password
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

// Function to load the user registration page
const loadRegister = async (req, res) => {
    try {
        res.render('user/signup');
    } catch (error) {
        console.log(error.message);
    }
}

// Function to insert a new user
const insertUser = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: spassword
        });

        const userData = await user.save();

        if (userData) {
            res.render('user/signup', { message: 'Your registration has been successful' });
        } else {
            res.render('user/signup', { message: 'Your registration has failed' });
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Function to load the user login page
const loginLoad = async (req, res) => {
    try {
        res.render('user/login');
    } catch (error) {
        console.log(error.message);
    }
}

// Function to verify user login
const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (passwordMatch) {
                req.session.user_id = userData._id;
                res.redirect('/home');
            } else {
                res.render('user/login', { message: "Email and password are incorrect" });
            }
        } else {
            res.render('user/login', { message: "Email and password are incorrect" });
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Function to load the user's home page
const loadHome = async (req, res) => {
    try {
        res.render('user/home');
    } catch (error) {
        console.log(error.message);
    }
}

// Function to handle user logout
const userLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout
}

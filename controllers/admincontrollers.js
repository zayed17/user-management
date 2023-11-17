const Admin = require('../models/adminmodel');
const User = require('../models/usermodel');
const bcrypt = require('bcrypt');

// Function to render the signup page
const signup = async (req, res) => {
    try {
        res.render('signup');
    } catch (error) {
        console.log(error.message);
    }
}

// Function to securely hash a password
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

// Function to insert a new admin
const insertAdmin = async (req, res) => {
    try {
        const { email } = req.body;
        const adminCheck = await Admin.findOne({ email });
        if (adminCheck) {
            return res.render("signup", {
                message: "Admin already exists, please login"
            });
        }

        const securepassword = await securePassword(req.body.password);
        const admin = new Admin({
            name: req.body.name,
            email: req.body.email,
            password: securepassword,
        });
        const adminData = await admin.save();

        if (adminData) {
            res.render('login', { message: "Sign up successfully, please login", color: "success" });
        } else {
            res.render('signup', { message: "Signup was not successful" });
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Function to render the home page
const home = async (req, res) => {
    try {
        var search = '';
        if (req.query.search) {
            search = req.query.search;
        }

        const message = req.query.message;
        const adminData = await Admin.findById({ _id: req.session.admin_id });
        const userData = await User.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { email: { $regex: '.*' + search + '.*', $options: 'i' } },
                { phone: { $regex: '.*' + search + '.*', $options: 'i' } },
            ]
        });
        res.render('home', { admin: adminData, users: userData, message: message });
    } catch (error) {
        console.log(error.message);
    }
}

// Function to render the login page
const LoadLogin = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

// Function to verify and handle admin login
const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const adminData = await Admin.findOne({ email: email });

        if (adminData) {
            const passwordMatch = await bcrypt.compare(password, adminData.password);

            if (passwordMatch) {
                req.session.admin_id = adminData._id;
                res.redirect('/admin/home');
            } else {
                res.render('login', { message: "Email and password are incorrect." });
            }
        } else {
            res.render('login', { message: "Email and password are incorrect." });
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Function to handle admin logout
const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/admin');
    } catch (error) {
        console.log(error.message);
    }
}

// Function to render the add user page
const adduser = async (req, res) => {
    try {
        res.render('add-user');
    } catch (error) {
        console.log(error.message);
    }
}

// Function to insert a new user
const insertuser = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const password = req.body.password;
        const hashedPassword = await securePassword(password);

        // Check if a user with the provided email already exists
        const userCheck = await User.findOne({ email: email });

        if (userCheck) {
            return res.render("add-user", {
                message: "User already exists, please try logging in instead",
                color: "red",
            });
        }

        const user = new User({
            name,
            email,
            mobile,
            password: hashedPassword,
        });

        const userData = await user.save();

        if (userData) {
            const message = "New user added";
            res.redirect(`/admin/home?message=${message}`);
        } else {
            res.render('add-user', { message: 'Something went wrong. Try again' });
        }
    } catch (error) {
        console.error(error.message);
    }
};

// Function to render the edit user page
const edituser = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById({ _id: id });
        if (userData) {
            res.render('edit-user', { user: userData });
        } else {
            res.redirect('/admin/home');
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Function to update user information
const updateuser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            { _id: req.body.id },
            { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile } }
        );
        const message = "Updated Successfully";
        res.redirect(`/admin/home?message=${message}`);
    } catch (error) {
        console.log(error.message);
    }
}

// Function to delete a user
const deleteuser = async (req, res) => {
    try {
        const id = req.query.id;
        await User.deleteOne({ _id: id });
        const message = "Delete successful";
        res.redirect(`/admin/home?message=${message}`);
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    LoadLogin,
    verifyLogin,
    home,
    logout,
    insertAdmin,
    signup,
    adduser,
    insertuser,
    edituser,
    updateuser,
    deleteuser
}

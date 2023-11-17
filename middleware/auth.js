const isLogin = (req, res, next) => {
    try {
        if (req.session.user_id) {
            // User is logged in, continue to the next middleware or route handler
            next();
        } else {
            // User is not logged in, redirect to the login page or another appropriate route
            res.redirect('/');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = (req, res, next) => {
    try {
        if (req.session.user_id) {
            // User is logged in, redirect to the home page or another appropriate route
            res.redirect('/home');
        } else {
            // User is not logged in, continue to the next middleware or route handler
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
}

// const validateForm = (req, res, next) => {
//     try {
//         const { email, name, phone } = req.body;
//         let regexEmail = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
//         let regexName = /\d/;
//         if (regexName.test(name)) {
//             return res.render('signup', { message: "Name shouldn't contain digits", color: "red" });

//         } if (name.length <= 5) {
//             return res.render('signup', { message: "minimum 5 characters in name", color: "red" });
//         }
//         if (!regexEmail.test(email)) {
//             return res.render('signup', { message: "Invalid email address", color: "red" });
//         }
//         next();
//     } catch (error) {
//         console.log(error);
//     }

// }


module.exports = {
    isLogin,
    isLogout,
    
}

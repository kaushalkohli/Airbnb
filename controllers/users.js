const User = require("../models/user")

// Signup form route
module.exports.signup = (req, res) => {
    res.render("users/signup.ejs");
}


// Create new usersignup route
module.exports.usersignup = async(req, res) => {
    try {
        const {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err)
            }
            req.flash("success", "Welcome to Page!");
            res.redirect("/listings");
        });
        
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}


// Create login user route
module.exports.login = (req, res) => {
    res.render("users/login.ejs")
}


// User login route - Fixed post method and added success flash message
module.exports.loginUser = async(req, res) => {
    req.flash("success", "Welcome back to Page!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


// Logout User
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings")
    })
}
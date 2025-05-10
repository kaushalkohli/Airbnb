const express = require("express");
const userRouter = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const reviewController = require("../controllers/users.js")


// Signup form route
userRouter.get("/signup", reviewController.signup);


// Create new usersignup route
userRouter.post("/signup", wrapAsync(reviewController.usersignup));


// Create login user route
userRouter.get("/login", reviewController.login);


// User login route - Fixed post method and added success flash message
userRouter.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login", 
        failureFlash: true
    }), 
    reviewController.loginUser);


// Logout User
userRouter.get("/logout", reviewController.logout);


module.exports = userRouter;
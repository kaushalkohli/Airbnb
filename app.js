if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const app = express()
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate')
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const port = 3010
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js");


// MongoDB session store 
const store = MongoStore.create({
    mongoUrl : process.env.ATLAS_URL,
    secret : process.env.SECRET,
    touchAfter : 24 * 60 * 60,          // time period in seconds
})

// session cookies  or  flash 
const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
}

store.on("error", () => {
    console.log("this error for mongo session ", err)
})


app.engine('ejs', ejsMate); 
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, '/public')))

app.use(session(sessionOptions));    // session middleware for flash messages and authentication
app.use(flash());


app.use(passport.initialize());       // This sets up Passport to handle user authentication.
app.use(passport.session())           // Enable persistent login sessions This allows Passport to serialize and deserialize user information in the session.                               
passport.use(new LocalStrategy(User.authenticate()))    // use static authenticate method of model in LocalStrategy
passport.serializeUser(User.serializeUser());       // serializeUser method of model to serialize the user into the session.
passport.deserializeUser(User.deserializeUser());   // deserializeUser method of model to deserialize the user from the session.


 
// Connect to MongoDB
const MONGO_URL = process.env.ATLAS_URL;
async function main(){
    await mongoose.connect(MONGO_URL )
}
main()
.then(()=>{
    console.log('MongoDB connected')} 
)
.catch((error)=>{
    console.log(error)
})


// middleware for flash 
app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next()
})
 


//Routes
app.get('/', (req, res) => {
    res.redirect('/listings')
})

app.use("/listings",listings)
app.use("/listings/:id/reviews", reviews);
app.use("/",userRouter)




// Meddleware 
app.use((err, req, res, next) => {
    res.send("something went wrong")
    next()
})


app.listen(port, ()=> {
    console.log(`server is running on port http://localhost:${port}`)
})




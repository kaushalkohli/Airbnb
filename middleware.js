const Listing = require("./models/listing")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema } = require('./schema.js');
const Review = require("./models/review.js")



module.exports.isLoggedIn = (req, res, next) => {
    
    if(!req.isAuthenticated()){                  // isAuthenticated inbuild fuction from passport validation check the user is exists
        req.session.redirectUrl = req.originalUrl;  // store the original URL in session
        req.flash("error","you must be logged in to create listing!")
        return res.redirect("/login");
    }

    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl    // store the original URL in locals
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to edit")
        return res.redirect("/listings")
    }
    next();
}

// listing validation schema 
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}

// reviews validation schema
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body)         // handling server error by joi listingSchema
         
    if(error){
        throw new ExpressError(400, error)           // handling express error function 
    }else{
        next();
    }
}

// reviews delete validations
module.exports.isReviewAuthor = async (req, res, next) => {
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the author of this reivews")
        return res.redirect(`/listings/${id}`);
    }
    next();
}
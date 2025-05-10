const express = require("express");
const router = express.Router({ mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema , reviewSchema } = require('../schema.js');
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require('../controllers/reviews')







// Post Reviews route 
router.post("/", validateReview ,isLoggedIn, wrapAsync(reviewController.createReview))

// Delete Reviews route
router.delete("/:reviewId", isLoggedIn ,isReviewAuthor, wrapAsync(reviewController.deletedReview))

module.exports = router;
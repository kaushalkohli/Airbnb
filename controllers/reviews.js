const Listing = require('../models/listing')
const Review = require("../models/review.js");


// new reviews create
module.exports.createReview = async(req, res) => {
    console.log(req.params.id)
    let listing = await Listing.findById(req.params.id);
    if (!listing){
        throw new ExpressError(404, "listing not found")
    }

    // Create new review
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    

    // Add review to listing's reviews array 
    listing.reviews.push(newReview);

    // Save both review and listing
    await newReview.save();
    await listing.save();

    // console.log("new review saved")
    req.flash("success","New Review Created")

    res.redirect(`/listings/${listing._id}`);
}


// reivews deleted
module.exports.deletedReview = async (req, res) =>{
    let {id, reviewId} = req.params

    // Remove the review reference from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted!")
    res.redirect(`/listings/${id}`)
}
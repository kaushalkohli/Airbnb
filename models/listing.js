const mongoose = require('mongoose');
const review = require('./review');
const  Schema  = mongoose.Schema;
const Review = require("./review.js")


// Define the schema for the listing
const listingSchema = new Schema({
    title: {
        type: String,
        
    },
    description: {
        type: String,
        
    },
    price: {
        type: Number,
        
    },
    location: {
        type: String,
        
    },
    image: {
        url: String,
        filename: String
    },
    country: {
        type: String
    },
    reviews: [
        {
            type : Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if (listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})

// Create a model from the schema
const Listing  = mongoose.model('Listing',listingSchema)
module.exports = Listing
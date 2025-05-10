const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require('../models/listing')
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")
const listingcontroller = require("../controllers/listings.js")
const multer = require("multer")
const {storage} = require('../CloudConfig.js')
const upload = multer({storage}) // multer configuration for file uploads 


// index route
router.get('/', wrapAsync(listingcontroller.index));


// render new form 
router.get('/new', isLoggedIn , listingcontroller.renderNewForm)


// show listings 
router.get('/:id', listingcontroller.showListing)


// create listings
router.post('/', isLoggedIn ,upload.single("listing[image]"),wrapAsync(listingcontroller.createListing));


// edit listings form
router.get('/:id/edit', isLoggedIn ,isOwner, wrapAsync(listingcontroller.EditListing));


// update listings
router.put('/:id', isLoggedIn , isOwner , upload.single("listing[image]") , wrapAsync(listingcontroller.updateListing));


// delete listings
router.delete("/:id", isLoggedIn ,isOwner, listingcontroller.deleteListing)


module.exports = router;
const Listing = require("../models/listing")


// index route
module.exports.index = async (req, res) => {
    const allListngs = await Listing.find({});
    // console.log(allListngs); // Add this line to debug
    res.render("listings/index.ejs", {allListngs});
}


// render new form 
module.exports.renderNewForm = (req, res) => { 
     res.render('listings/new.ejs')
}


// show listings 
module.exports.showListing = async (req, res) => {
    const {id} = req.params
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner")
    if(!listing){
        req.flash("error","Listing you requested for doesn't exist !")
        res.redirect("/listings");
    }
    // console.log(listing)
    res.render('listings/show.ejs', {listing})
}


// create listings
module.exports.createListing = async (req, res, next) => {
    const url = req.file.path;
    const filename = req.file.filename;
    

    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid listing data");
    }
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id
    newListing.image = {url, filename}
    await newListing.save();
    req.flash("success","New listing Created")
    res.redirect("/listings"); // Use newListing._id instead of id
}

 
// edit listings form
module.exports.EditListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit.ejs", { listing });
}


// update listings
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if(req.file){
        let url = req.file.path
        let filename = req.file.filename
        listing.image = {url, filename}
        await listing.save();
    }
    
    // console.log("Update Data:", req.body.listing);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    req.flash("success","Listing updated !")
    res.redirect(`/listings/${id}`);
}


// delete listings
module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted!")
    res.redirect("/listings")
}
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");





// INDEX ROUTE
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

// NEW route
router.get("/new", isLoggedIn, (req, res) => {
res.render("listings/new.ejs");
});


//SHOW ROUTE
router.get(
    "/:id",
 wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
     populate: {
        path: "author",
    },
    })
    .populate("owner");
    if(!listing){
        req.flash("error" , "listing is not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });

}));


//CREATE route
router.post("/", isLoggedIn, validateListing,  wrapAsync(async (req, res, next) => {
    
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success" , "new listing is created successfully");
        res.redirect("/listings");

 }));
 

// EDIT route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "listing is not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//UPDATE route
router.put("/:id", isLoggedIn, isOwner,  validateListing, wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400 , "send valid data for listing");
     }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success" , " listing is updated successfully");
    res.redirect(`/listings/${id}`);
}));

//DELETE route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListings = await Listing.findByIdAndDelete(id);
    console.log(deletedListings);
    req.flash("success" , " listing is deleted successfully");
    res.redirect("/listings");
}));

module.exports = router;
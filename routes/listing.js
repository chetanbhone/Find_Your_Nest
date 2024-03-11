const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {listingSchema  }=require("../schema.js");



// server validation ( middleware )
const validateListing = (req, res, next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }else{
        next();
    }
 } ;


// INDEX ROUTE
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

// NEW route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
});


//SHOW ROUTE
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error" , "listing is not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });

}));


//CREATE route
router.post("/", validateListing,  wrapAsync(async (req, res, next) => {
    
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success" , "new listing is created successfully");
        res.redirect("/listings");

 }));
 

// EDIT route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "listing is not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//UPDATE route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400 , "send valid data for listing");
     }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success" , " listing is updated successfully");
    res.redirect(`/listings/${id}`);
}));

//DELETE route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListings = await Listing.findByIdAndDelete(id);
    console.log(deletedListings);
    req.flash("success" , " listing is deleted successfully");
    res.redirect("/listings");
}));

module.exports = router;
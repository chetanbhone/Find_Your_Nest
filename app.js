const express = require("express");
const app = express();
const mongoose = require("mongoose");
// require the listing
const Listing = require("./models/listing.js");
const path = require("path");
const methodeOverride = require("method-override");
const ejsMate = require("ejs-mate");

// require utils
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");

// require schema validation
const {listingSchema}=require("./schema.js");

// connect to db

const DB_url = ("mongodb://127.0.0.1:27017/wanderLust");

main().then(() => {
    console.log("connected to database");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(DB_url);

};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodeOverride("_method"));
app.engine("ejs", ejsMate);
// to serve static
app.use(express.static(path.join(__dirname, "/public")));


// port design

app.listen(3030, () => {
    console.log("server is working");
});


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
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

// NEW route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
});


//SHOW ROUTE
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });

}));


//CREATE route
app.post("/listings", validateListing,  wrapAsync(async (req, res, next) => {
    
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");

 }));
 

// EDIT route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//UPDATE route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400 , "send valid data for listing");
     }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//DELETE route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListings = await Listing.findByIdAndDelete(id);
    console.log(deletedListings);
    res.redirect("/listings");
}));

// page not found Error
app.all("*",(req, res, next)=>{
    next(new ExpressError(404, "page not found"));
});

//custom error handeling using middleware
app.use((err, req, res, next) => {
    let{statusCode=500, message="something went wrong !"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs" , {err});
});




app.get("/", (req, res) => {
    console.log("route is working");
    res.send("welcome");
});


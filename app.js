const express = require("express");
const app = express();
const mongoose = require("mongoose");
// require the listing

const path = require("path");
const methodeOverride = require("method-override");
const ejsMate = require("ejs-mate");
// test


const ExpressError= require("./utils/ExpressError.js");


// listings routes require
const listings= require("./routes/listing.js");

// review routes require
const reviews = require("./routes/review.js");

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

app.set("view engine", "ejs");   // set tempeliting engine 
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); //form getting data from form
app.use(methodeOverride("_method"));
app.engine("ejs", ejsMate);
// to serve static like css
app.use(express.static(path.join(__dirname, "/public")));


// port design

app.listen(3030, () => {
    console.log("server is working");
});

 // use listings router
 app.use("/listings" , listings);

 // use review router
 app.use("/listings/:id/reviews" , reviews);



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


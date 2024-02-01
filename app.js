const express= require("express");
const app=express();
const mongoose= require("mongoose");
// require the listing
const Listing = require("./models/listing.js");
const path= require ("path");
const methodeOverride= require("method-override");
const ejsMate= require("ejs-mate");

// connect to db

const DB_url=("mongodb://127.0.0.1:27017/wanderLust");

main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(DB_url);
  
};

app.set("view engine","ejs" );
app.set("views" , path.join(__dirname , "views")); 
app.use(express.urlencoded({extended : true}));
app.use(methodeOverride("_method"));
app.engine("ejs", ejsMate);
// to serve static
app.use(express.static(path.join(__dirname , "/public")));


// port design

app.listen(3030 , ()=>{
    console.log("server is working");
});


// INDEX ROUTE
 app.get("/listings" , async (req, res)=>{
    const allListings= await Listing.find({});
          res.render("./listings/index.ejs" , {allListings});
    });
   
  // NEW route
  app.get("/listings/new" , (req, res)=>{
        res.render("listings/new.ejs")
  });


//SHOW ROUTE
 app.get("/listings/:id" , async (req , res)=>{
    let {id}= req.params;
 const listing =  await Listing.findById(id);
 res.render("listings/show.ejs" , {listing});  

 });


 //CREATE route
 app.post("/listings" , async (req , res)=>{
    //  let {title , description , image , price , country , location}=req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
     res.redirect("/listings");
 });


 // EDIT route
 app.get("/listings/:id/edit" , async(req , res)=>{
    let {id}= req.params;
    const listing =  await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing}); 
 });

//UPDATE route
app.put("/listings/:id" , async(req,res)=>{
    let {id}= req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
});

//DELETE route
app.delete("/listings/:id" , async(req , res)=>{
    let {id}= req.params;
let deletedListings= await Listing.findByIdAndDelete(id);
console.log(deletedListings);
    res.redirect("/listings");
});



// testing of schema
// app.get("/testListing" , async (req , res)=>{
//      let sampleListing= new Listing({
//      title : "my new home",
//      description : "near the beach",
//      price : 1200,
//      location : "maharashtra goa",
//      country : "india",
//      });

//      // save in database
//      await sampleListing.save();
//      console.log("sample was saved");
//      res.send("successfull testing");
// });



app.get("/" , (req, res)=>{
   console.log("route is working");
   res.send("welcome");
});


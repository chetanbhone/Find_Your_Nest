const  mongoose= require("mongoose");
const Schema = mongoose.Schema;

// create a listing Schema
const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
        type : String,
        default:"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXRpZnVsJTIwaG91c2V8ZW58MHx8MHx8fDA%3D",
        set : (v)=> v ==="" ? "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXRpZnVsJTIwaG91c2V8ZW58MHx8MHx8fDA%3D" : v,
    },
    price : Number,   
    location : String,   
    country : String,                 
});

// creating a model
const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;
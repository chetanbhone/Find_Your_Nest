const  mongoose= require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

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
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ],           
    owner: {
        type : Schema.Types.ObjectId,
        ref: "User",
    }
});

// for delete reviews with listing
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in :listing.reviews}});
    }
});

// creating a model
const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;
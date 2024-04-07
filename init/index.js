const mongoose = require("mongoose");

const initData = require("./data.js");
const Listing = require("../models/listing.js");

const DB_url=("mongodb://127.0.0.1:27017/wanderLust");
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(DB_url);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj, owner: "65f81c3b1f96c984508aaebb"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();

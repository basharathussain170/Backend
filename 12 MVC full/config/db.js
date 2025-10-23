const mongoose = require("mongoose");

const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("DB connection successfull")
  } catch (err) {
    console.log("MongoDB Connection Failed")
  }
};

module.exports=connectDB;

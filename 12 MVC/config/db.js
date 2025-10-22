const mongoose=require('mongoose');

const connectDB=()=>{
  try{
    mongoose.connect(process.env.MONGO_URI)
    console.log("Mongo DB connected Successfully!")
  }catch(err){
    console.log("Mongo Connection failed!")
  }
}
module.exports=connectDB
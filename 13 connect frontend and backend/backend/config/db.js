const mongoose=require('mongoose');


const connectDB=async()=>{
  try{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
      console.log(`DB connection successfull!`)
    })
    .catch(()=>{
      console.log("DB connection Failed!")
    })
  }catch(err){
    console.log("Error while connecting DB",err)
  }
}
module.exports=connectDB;
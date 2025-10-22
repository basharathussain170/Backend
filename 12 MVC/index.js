//External Module
const express=require('express');
const dotenv=require('dotenv')
dotenv.config();

const app=express();

//local module
const connectDB=require('./config/db')
const userRoutes=require('./routes/userRoutes')



connectDB();
app.use(express.json());
app.use(userRoutes)








const PORT=3000;
app.listen(PORT,()=>{
  console.log("Server is listening on port 3000")
})
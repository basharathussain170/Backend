const express=require('express');
const dotenv=require('dotenv')
const app=express();
dotenv.config();


//local module
const connectDB=require('./config/db')
const authRoutes=require('./routes/authRoutes')
const userRoutes=require('./routes/userRoutes')


app.use(express.json());
connectDB();

app.use(authRoutes)
app.use(userRoutes)















const PORT=3000;
app.listen(PORT,()=>{
  console.log("Server is listening on port 3000")
})
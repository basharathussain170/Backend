const express=require('express')
const userRouter=express.Router();

userRouter.get('/',(req,res)=>{
  res.send("All users fetched successfully!")
})

userRouter.post('/register',(req,res)=>{
  const{name,email}=req.body
  res.send(`Hi ${name} your email is ${email}`)
})

module.exports=userRouter
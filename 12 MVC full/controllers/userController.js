const jwt=require('jsonwebtoken')

const Users = require("../models/Users");
const RefreshTokens = require('../models/RefreshTokens');



exports.profile=async(req,res)=>{
  const id=req.user.userId;
  const user=await Users.findOne({_id:id})
  res.json({message:"Welcome",user})
}

exports.allUsers=async(req,res)=>{
  const allUsers=await Users.find();
  res.send(allUsers)
}

exports.refreshToken=async(req,res)=>{
  const refreshToken=req.body.token;
  if(!refreshToken)return res.status(403).send("Token Missing!");

  const isRefreshToken=await RefreshTokens.findOne({token:refreshToken});
  if(!isRefreshToken)return res.status(403).send("Token Not found in DB");

  try{
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN,(err,user)=>{
    if(err)return res.status(403).send("Refresh Token is Not Valid or Expired");
    const newAccessToken=jwt.sign({userId:user.userId,role:user.role},process.env.ACCESS_TOKEN,{expiresIn:"1m"});
    req.user=user;
    console.log("user in refresh token",user)
    res.json({accessToken:newAccessToken});
  })
  }catch(err){
    res.status(403).send("Error while giving new access token");
  }
}
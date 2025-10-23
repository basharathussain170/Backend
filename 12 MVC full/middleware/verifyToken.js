const jwt=require('jsonwebtoken')

const verifyToken = (req,res,next) => {
  const accessToken=req.headers.authorization;
  if(!accessToken)return res.status(404).send("Token Missing!");

  try{
    jwt.verify(accessToken,process.env.ACCESS_TOKEN,(err,user)=>{
    if(err)return res.status(404).send("Access Denied .Invalid Token!");
    req.user=user;
    next();
  })
  }catch(err){
    res.status(404).send("Invalid token or Expired!")
  }
};
module.exports=verifyToken;

//external module
const express=require('express');
const router=express.Router();

//local mdoule
const User=require('../models/Users')
const userController=require('../controllers/userController')
const verifyToken=require('../middleware/authMiddleware')


router.post("/signup",userController.signup);
router.post("/login",userController.login);
router.get("/profile",verifyToken,(req,res)=>{
  res.send(`Welcome ${req.user.userId}`)
})
router.post('/refresh',userController.takeRefreshToken)

router.post('/logout',userController.logout)

router.get("/all-users",verifyToken,userController.isAdmin,async(req,res)=>{
  const allUsers=await User.find()
  res.json(allUsers);
})









module.exports=router




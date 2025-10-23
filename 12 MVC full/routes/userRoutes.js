const express=require('express');
const router=express.Router();

const userController=require('../controllers/userController');
const verifyToken=require('../middleware/verifyToken')
const isAdmin=require('../middleware/isAdmin')

router.get("/profile",verifyToken,userController.profile)
router.get("/all-users",verifyToken,isAdmin,userController.allUsers)
router.post("/refresh",userController.refreshToken)


module.exports=router
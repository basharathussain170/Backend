//External module
const express = require("express");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

const app = express();
app.use(express.json())
const users = [];

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ id: users.length + 1, name, email, password: hashedPassword });
  res.send("User Register Successfully");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userExist = users.find((u) => email === u.email);
  if (!userExist) return res.status(404).send("User not found!");
  const isMatch = await bcrypt.compare(password, userExist.password);
  if (!isMatch) return res.status(404).send("Passowrd not matched!");

  const token = jwt.sign({ userId: userExist.id },process.env.JWT_SECRET,{expiresIn:"1m"});
  
  res.json({message:"Login successfully",token})
});


function auth(req,res,next){
  const token=req.headers.authorization;
  if(!token)return res.status(404).send('Token Missing!');

  try{
    const decode=jwt.verify(token,process.env.JWT_SECRET)
    req.user=decode;
    console.log(decode)
    next();
  }catch(err){
    res.status(404).send("Invalid or Expire token");
  }
}

app.get('/secret',auth,(req,res)=>{
  res.send('You have accessed the secret data!')
})

app.post('/logout',(req,res)=>{
  res.send("Log out successfully Please remove token from client side")
})






const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is listening on port 3000");
});

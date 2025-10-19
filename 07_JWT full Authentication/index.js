//External module
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();

//local module
const User = require("./models/Users");
let blacklist;

app.use(express.json());

const DB_PATH = `mongodb+srv://basharathussain0170:${process.env.DB_PASSWORD}@basharat.g4vdmxa.mongodb.net/jwtFullAuthentication?retryWrites=true&w=majority&appName=Basharat`;
mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("DB connected!");
  })
  .catch(() => {
    console.log("Connection Failed from DB");
  });

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) return res.status(404).send("User already exist!");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.send("Registerd Successfully !");
  } catch (err) {
    console.log("Error while registeration:", err);
    res.status(404).send("Error while registered:", err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User Does not Exist!");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(404).send("Password Incorrect!");

    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
    blacklist = token;
    console.log("login blacklist value:", blacklist);
    console.log("login token is:", token);

    res.send("Login Successfully!", token);
  } catch (err) {
    console.log("Error while login", err);
  }
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(404).send("Token Missing!");
  if (!blacklist) return res.status(404).send("Token invalid", blacklist);
  try {
    const decode = jwt.verify(token, process.env.JWT_KEY);
    req.user = decode;
    next();
  } catch (err) {
    res.status(404).send("Invalid Token !", err);
  }
}

app.get("/profile", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  console.log("now you can see secret file");
  res.send(user);
});

app.put("/updateProfile", verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name },
      { new: true }
    ).select("-password");
    console.log("Update successfully!");
    res.send(user);
  } catch (err) {
    res.status(404).send("Error while updating!");
  }
});

app.delete('/deleteAccount',verifyToken,async(req,res)=>{
  try{
    await User.findByIdAndDelete(req.user.userId)
    console.log("Deleted Data successfully!")
    res.send('Delete User Successfylly!')
  }catch(err){
    res.status(404).send('Failed to Delete!',err)
  }
})

app.post("/logout", (req, res) => {
  // const token=req.headers.authorization
  blacklist = "";
  try {
    res.send("Logged out successfully (token invalid after 1 hour)");
  } catch (err) {
    res.status(404).send("Failed while logout!", err);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

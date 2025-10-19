//External Module
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

//local module
require("dotenv").config();
const User = require("./models/Users");

const DB_PATH = `mongodb+srv://basharathussain0170:${process.env.DB_PASSWORD}@basharat.g4vdmxa.mongodb.net/authentication?retryWrites=true&w=majority&appName=Basharat`;

app.use(express.json());

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Successfully connected DB");
  })
  .catch((err) => {
    console.log("Failed to connect DB!");
  });

app.post("/signup", async (req, res) => {
  try {
    const { name, pass, email } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) return res.status(404).send("User already exist!");

    const hashedPassword = await bcrypt.hash(pass, 10);
    const newUser = new User({ name, email, pass: hashedPassword });
    await newUser.save();
    console.log("Register successfully !");
    res.send("Successfully Registerd New User!");
  } catch (err) {
    res.status(404).send("Failed to Register !", err);
  }
});

app.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send("User not found!");

  const isMatch = await bcrypt.compare(pass, user.pass);
  if (!isMatch) return res.status(404).send("Invalid Password!");

  const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
    expiresIn: "1h",
  });

  // console.log(token);
  res.send("You have successfully login!", token);
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(404).send("Token Missing!");

  try {
    const matchedToken = jwt.verify(token, process.env.JWT_KEY);
    req.superman = matchedToken;
    next();
  } catch (err) {
    res.status(404).send("Invalid or Expired Token!");
  }
}

app.get("/profile", verifyToken, async (req, res) => {
  const user = await User.findById(req.superman.userId).select("-pass"); //give all data except pass becuse i use -pass
  // console.log(user)
  res.send(user);
});


app.get("/users", async (req, res) => {
  const user = await User.find();
  res.send(user);
});








const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

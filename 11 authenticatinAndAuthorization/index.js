const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const DB_PATH = `mongodb+srv://basharathussain0170:${process.env.DB_PASSWORD}@basharat.g4vdmxa.mongodb.net/authorization?retryWrites=true&w=majority&appName=Basharat`;

const User = require("./models/Users");
const RefreshToken = require("./models/RefreshToken");

app.use(express.json());

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("DB connected ");
  })
  .catch(() => {
    console.log("DB Connection failed!");
  });

app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await User.findOne({ email });
  if (user) return res.status(404).send("User already exist");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, role });
  await newUser.save();
  res.send(newUser);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send("User not found!");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(404).send("Invalide password");

  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "1m" }
  );
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_SECRET
  );

  await RefreshToken({ token: refreshToken, userId: user._id }).save();
  res.json({ accessToken, refreshToken });
});

app.post("/refresh", async (req, res) => {
  const refSavedToken = req.body.token;
  if (!refSavedToken) return res.status(404).send("Token missing");
  const savedToken = await RefreshToken.findOne({ token: refSavedToken });
  if (!savedToken) return res.status(404).send("Invalid refresh token!");

  jwt.verify(refSavedToken, process.env.REFRESH_SECRET, (err, user) => {
    if (err) return res.status(404).send("expired token");
    const newAccessToken = jwt.sign(
      { userId: user.userId },
      process.env.ACCESS_SECRET,
      { expiresIn: "1m" }
    );
    console.log(newAccessToken)
    res.json({ accessToken: newAccessToken });
  });
});

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(404).send("Token Missing");
  jwt.verify(authHeader, process.env.ACCESS_SECRET, (err, user) => {
    if (err) return res.status(404).send("Expired Token or Invalid token");
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== "admin")
    return res.status(404).send("You have not permission");
  next();
}

app.get("/profile", verifyToken, (req, res) => {
  console.log(req.user)
  res.send(`Welcom ${req.user.userId}`);
});

app.get("/all-users", verifyToken, isAdmin, async (req, res) => {
  const user = await User.find();
  res.send(user);
});

app.post("/logout",async(req,res)=>{
  const token=req.body.token;
  await RefreshToken.findOneAndDelete({token})
  res.send("Logged out and RefreshToken deleted from DB!")
})

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server is listening on port 3000");
});

//External Module
const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

//local module
const User = require("./models/Users");
const RefreshToken = require("./models/Refreshtoken");

const DB_PATH = `mongodb+srv://basharathussain0170:${process.env.DB_PASSWORD}@basharat.g4vdmxa.mongodb.net/authorization?retryWrites=true&w=majority&appName=Basharat`;
// let blacklistedToken = [];

app.use(express.json());

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("DB Connected!");
  })
  .catch(() => {
    console.log("DB Connection Failed!");
  });

app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await User.findOne({ email });
  if (user) return res.status(404).send("User already exist!");
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, role });
  await newUser.save();
  res.send("User registerd!");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send("User doest not exist");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(404).send("Invalid password");

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_SECRET
  );
  await RefreshToken({ token: refreshToken, userId: user._id }).save();
  res.json({ accessToken, refreshToken });
});

function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;
  if (!authToken) return res.status(404).send("Token missing");

  // if (blacklistedToken.includes(authToken))
  //   return res.status(404).send("token blaklisted!");

  jwt.verify(authToken, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(404).send("Token invalid Or expired");
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== "admin") return res.status(404).send("Access denied");
  next();
}

app.post("/refresh", async (req, res) => {
  const token = req.body;
  if (!token) return res.status(404).send("Token missing");
  const savedToken = await RefreshToken.findOne({ token });
  if (!savedToken) return res.status(404).send("Invalid refresh token!");
  jwt.verify(
    token,
    process.env.REFRESH_SECRET,
    (err, user) => {
      if (err) return res.status(404).send("Expires token");
     const newAccessToken= jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1m",
      });
      res.json({accessToken:newAccessToken})
    }
  );

});

//accessible for all user
app.get("/profile", verifyToken, async (req, res) => {
  console.log(req.user);
  res.send(`Welcom user with ID : ${req.user.id}`);
});

//accessible for only admin
app.get("/all-users", verifyToken, isAdmin, async (req, res) => {
  const users = await User.find();
  res.send(users);
});

app.post("/logout", verifyToken, async(req, res) => {
  const token=req.body
  await RefreshToken.findOneAndDelete({token})
  // blacklistedToken.push(req.headers.authorization);
  res.send("Successfully Loged out");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is listening on 3000");
});

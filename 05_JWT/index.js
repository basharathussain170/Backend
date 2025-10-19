//external module
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();

//local module
const User = require("./models/Users");

const DB_PATH = `mongodb+srv://basharathussain0170:${process.env.DB_PASSWORD}@basharat.g4vdmxa.mongodb.net/JWT?retryWrites=true&w=majority&appName=Basharat`;

app.use(express.json());

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log("Connection failed!", err);
  });

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("user already exist!");
      return res.status(404).send("User already exist");
    }
    const hashedPassword = await bcrypt.hash(password, 10); //used for hashing passowrd
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.send("User register successfully!");
  } catch (err) {
    console.log("Error during signup");
    res.status(404).send("Error while signpu!");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password); //used for compare after doing decrypt
    if (!isMatch) {
      return res.status(404).send("Wrong Password!");
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // console.log(token);
    res.json({ message: "Login successfully", token });
  } catch (err) {
    res.status(404).send("Error while login!");
  }
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    res.status(404).send("Token missing");
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.superman = decode;
    next();
  } catch (err) {
    res.status(404).send("Invalid token");
  }
}

app.get("/profile", verifyToken, async (req, res) => {
  const user = await User.findById(req.superman.userId).select("-password");
  res.send(user);
});

app.get("/users", async (req, res) => {
  try {
    const user = await User.find();
    console.log(user);
    res.send(user);
  } catch (err) {
    res.status(404).send("Error while fetching users");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

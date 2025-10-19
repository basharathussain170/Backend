const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/Users");

const app = express();
app.use(express.json());

const DB_PATH = `mongodb+srv://basharathussain0170:${process.env.DB_PASSWORD}@basharat.g4vdmxa.mongodb.net/mongodbPractice?retryWrites=true&w=majority&appName=Basharat`;

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Database Successfully connected!");
  })
  .catch((err) => {
    console.log("Failed to connect Database!", err);
  });

app.post("/secret", async (req, res) => {
  try {
    const reqMail = req.headers.authorization;
    const user = await User.findOne({ email: reqMail });
    if (user) {
      res.send("you have permission to access secret file!");
    } else {
      res.send("You have not permission");
    }
  } catch (err) {
    res.status(404).send("Fiailed to authorized!");
  }
});

app.get("/users", async (req, res) => {
  try {
    const user = await User.find();
    res.send(user);
  } catch (err) {
    res.status(404).send("Failed to load", err);
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("Data saved successfully");
  } catch (err) {
    res.status(404).send("Error while save data");
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send({ "updated successfully": updatedUser });
  } catch (err) {
    res.status(404).send("Failed to Update!");
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const deleteData = await User.findByIdAndDelete(req.params.id);
    res.send({ "Deleted successfully": deleteData });
  } catch (err) {
    res.send("Error while Deleteing", err);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server listening on port 3000");
});

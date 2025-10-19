//External Module
const express = require("express");
const mongoose = require("mongoose");
const app = express();

//core module
require("dotenv").config();

//local module
const User = require("./models/User");

const DB_PATH = `mongodb+srv://basharathussain0170:${process.env.DB_PASSWORD}@basharat.g4vdmxa.mongodb.net/backendDB?retryWrites=true&w=majority&appName=Basharat`;

app.use(express.json());

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log("Database Connection failed", err);
  });

app.post("/user", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    console.log("Data saved successfully!");
    res.send(user);
  } catch (err) {
    console.log("failed to save data", err);
    res.status(404).send(err);
  }
});

app.get("/user", async (req, res) => {
  try {
    // const user = await User.findById("68f21a0870cfd4fdb6a1d2e0");
    const user = await User.find();
    console.log("successfully fetched data!");
    res.send(user);
  } catch (err) {
    console.log("failed to fetch data", err);
  }
});


app.put("/user/:id",async(req,res)=>{
  try{
    const userId=req.params.id
    const user=await User.findByIdAndUpdate(userId,req.body,{new:true})
    res.send(user)
  }catch(err){
    console.log('failed to update')
    res.status(404).send('Failed to updata ')
  }
})


app.delete("/user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    console.log("user Deleted!");
    res.send("deleted user");
  } catch (err) {
    res.status(404).send(err.message);
  }
});





const PORT = 3000;
app.listen(PORT, () => {
  console.log("server is listening on port 3000");
});

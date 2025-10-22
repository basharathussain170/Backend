const mongoose = require("mongoose");

const refreshToken = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now, expires: "7d" },
});
module.exports=mongoose.model("RefreshToken",refreshToken)
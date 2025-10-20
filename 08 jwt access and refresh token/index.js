//external module
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

//local module
const user = { id: 1, name: "Basharat Hussain" };
let refreshTokens = [];

app.use(express.json());

app.post("/login", async (req, res) => {
  const accessToken = jwt.sign(user, process.env.ACCESS_SECRET, {
    expiresIn: "30s",
  });
  console.log("Acess token in login :",accessToken)
  const refToken = jwt.sign(user,process.env.REFRESH_SECRET);
  refreshTokens.push(refToken);
  console.log("refresh token in login:",refToken)

  res.json({ accessToken, refToken });
});

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.status(404).send("Token missing!");
  if (!refreshTokens.includes(refreshToken))
    return res.status(404).send("Invalid token");

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
    if (err) return res.status(404).send("Invalid refresh token");
    const newAccessToken = jwt.sign(
      { id: user.id, name: user.name },
      process.env.ACCESS_SECRET,
      { expiresIn: "30s" }
    );
    console.log("new access token in refresh",newAccessToken)
    res.json({ accessToken: newAccessToken });
  });
});

app.post("/logout", (req, res) => {
  const refToken = req.body.token;
  refreshTokens.filter((t) => t !== refToken);
  res.send("Logged out successfully!");
});

//middleware 
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(404).send("Token missing!");

  jwt.verify(authHeader, process.env.ACCESS_SECRET, (err, user) => {
    if (err) return res.status(404).send("token expired or invalide token");
    req.user = user;
    console.log("in authenticate func user",user)
    next();
  });
}

app.get("/profile", authenticateToken, (req, res) => {
  res.send(`Welcome ${user.name}`);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is listening on port 3000");
});

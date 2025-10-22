const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

const user = { id: 1, name: "basharat hussain" };
const refreshTokens = [];

app.post("/login", (req, res) => {
  const accessTokn = jwt.sign(user, process.env.ACCESS_TOKEN, {
    expiresIn: "1m",
  });
  const refToken = jwt.sign(user, process.env.REFRESH_TOKEN);
  refreshTokens.push(refToken);
  res.send({ accessTokn, refToken });
});

app.post("/refresh", (req, res) => {
  const refToken = req.body.token;
  if (!refToken) return res.status(404).send("Token missing!");
  if (!refreshTokens.includes(refToken))
    return res.status(404).send("Token invalide or expired!");

  const newAccessToken = jwt.sign(
    { id: user.id, name: user.name },
    process.env.REFRESH_TOKEN,
    { expiresIn: "1m" }
  );
  res.json({ accessTokn: newAccessToken });
});

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(404).send("Token Missing!");
  jwt.verify(authHeader, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) return res.status(404).send("token expired or invalid!");
    req.user = user;
    next();
  });
}

app.get("/profile", verifyToken, (req, res) => {
  res.send(`Welcom ${user.name}`);
});

app.post("/logout", (req, res) => {
  const token = req.body.token;
  if (!token) return res.status(404).send("Token missing!");
  refreshTokens = refreshTokens.filter((t) => token !== t);
  res.send("Logged out successfully!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is listening on 3000");
});

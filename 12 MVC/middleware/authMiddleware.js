const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(404).send("Token missing");
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) return res.status(404).send("Invalid or Expired Token");
      req.user = user;
      console.log("User while verify",user)
      next();
    });
  } catch (err) {
    res.status(404).send("Error while Verify Token!");
  }
}
module.exports=verifyToken;

const Users = require("../models/Users");

module.exports = async (req, res) => {
  console.log("user in isadmin middleware",req.user)
  if (req.user.role !== "admin")
    return res.status(403).send("Access Denied Secret Route");
  const user = await Users.find();
  res.send(user);
};

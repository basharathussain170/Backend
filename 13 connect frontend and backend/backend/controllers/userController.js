const User = require("../models/User");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    // console.log(user)
    res.json({ message: "Registerd Successfully", user });
  } catch (err) {
    res.status(404).send("Error while register user");
  }
};
module.exports = { registerUser };

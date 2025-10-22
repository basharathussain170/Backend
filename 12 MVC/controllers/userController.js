//external module
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//loca module
const User = require("../models/Users");
const RefreshToken = require("../models/RefreshToken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) return res.status(404).send("User already Exist");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    console.log(newUser);
    res.send("Register Successfully!");
  } catch (err) {
    console.log("Failed to Signup!");
    res.status(404).send("Error while Register!:", err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found!");
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(404).send("Invalid Password!");

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN
    );
    await new RefreshToken({ token: refreshToken, userId: user._id }).save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.log("Error while login", err);
    res.status(404).send("Error while login");
  }
};

exports.takeRefreshToken = async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.status(404).send("Refresh Token missing!");
  try {
    const savedRefreshToken = await RefreshToken.findOne({
      token: refreshToken,
    });
    if (!savedRefreshToken) return res.status(404).send("Ref token not valid");

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
      if (err) return res.status(404).send("Refresh Token Missing");
      const newAccessToken = jwt.sign(
        { userId: user.userId },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "1m",
        }
      );
      req.user = user;
      res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    res.status(404).send("Error while taking new access token!");
  }
};

exports.logout = async (req, res) => {
  const token = req.body.token;
  await RefreshToken.findOneAndDelete({ token });
  res.send("Logged out successfully");
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(404).send("Access denied. Admin only!");
  next();
};

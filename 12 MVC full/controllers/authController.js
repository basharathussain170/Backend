//External module
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//local module
const User = require("../models/Users");
const RefreshTokens = require("../models/RefreshTokens");

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(404).send("User already found!");
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    console.log("Sign up User", user);
    res.send("User register successfully!");
  } catch (err) {
    res.status(404).send("Failed to register!", err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(404).send("Password Not matched!");

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id,role:user.role },
      process.env.REFRESH_TOKEN
    );

    const isRefreshToken = await RefreshTokens.findOne({
      userId: user._id,
    });
    if (!isRefreshToken) {
      await RefreshTokens({ token: refreshToken, userId: user._id }).save();
      return res.json({ accessToken, refreshToken });
    } else {
      console.log("Refresh token already exist , so don't save again!");
    }
    const savedRefreshToken = isRefreshToken.token;
    res.json({ accessToken, savedRefreshToken });
  } catch (err) {
    res.status(404).send("Failed while login");
  }
};

exports.logout=async(req,res)=>{
  const{token}=req.body;
  const deletedToken=await RefreshTokens.findOneAndDelete({token});
  if(!deletedToken){
    return res.status(404).send("Logout Successfully!")
  }else{
    return res.status(404).send("Log and token delted from DB");
  }

}
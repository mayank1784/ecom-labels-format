const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/userModel");

exports.loginUser = async (req, res) => {
  try {
    const userData = req.body.user;
    let existingUser = await User.findOne({ email: userData.email });
    if (!existingUser) {
      existingUser = await User.create({
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
      });
    }
    const sessionToken = jwt.sign({ user: userData }, process.env.JWT_SECRET);
    res.status(200).json({ sessionToken });
  } catch (err) {
    console.error("Google Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUser = async(req,res) => {
  try{
    res.status(200).json(req.user);
  }catch(err){
    console.error(err);
    res.status(404).json({message: "User not found"});
  }
}
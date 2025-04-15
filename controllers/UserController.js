const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    password,
    medicalReport,
    location,
    profileImage,
    govId,
    emergencyContact,
  } = req.body;

  try {
    const newUser = await User.create({
      name,
      email,
      phone,
      address,
      password,
      medicalReport,
      location,
      profileImage,
      govId,
      emergencyContact,
    });

    if (newUser) {
      return res.status(201).json({ message: "User created successfully" });
    }
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).json({ error: firstError }); // "Email is required"
    }
    if (err.code === 11000 && err.keyValue.email) {
      //Error code 11000 is for duplicate key error when unique: true
      return res
        .status(400)
        .json({ error: "User with this Email already exists" });
    }
    if (err.code === 11000 && err.keyValue.phone) {
      return res
        .status(400)
        .json({ error: "User with this Phone Number already exists" });
    }
    if (err.code === 11000 && err.keyValue.govId) {
      return res
        .status(400)
        .json({ error: "User with this Government ID already exists" });
    }
    return res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateUserInfo = async (req, res) => {
  const { userId } = req.params;
  const {
    name,
    email,
    phone,
    address,
    password,
    medicalReport,
    location,
    profileImage,
    emergencyContact,
  } = req.body;

try {  
    const updatedUser = await User.findByIdAndUpdate(userId, {
      name,
      email,
      phone,
      address,
      password,
      medicalReport,
      location,
      profileImage,
      emergencyContact,
    }, { new: true });

    res.status(200).json({message: "User updated successfully", user: updatedUser});
}catch (err){
    console.log(err);
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).json({ error: firstError });
    }
    if (err.code === 11000 && err.keyValue.email) {
      //Error code 11000 is for duplicate key error when unique: true
      return res
        .status(400)
        .json({ error: "User with this Email already exists" });
    }
    if (err.code === 11000 && err.keyValue.phone) {
      return res
        .status(400)
        .json({ error: "User with this Phone Number already exists" });
    }
    return res.status(500).json({ message: "Error updating user", error: err.message });
  }
}

module.exports = { registerUser, getAllUsers, updateUserInfo };

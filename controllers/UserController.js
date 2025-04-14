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

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(401).json({ message: "Invalid email " });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    return res
      .status(200)
      .json({ message: "User logged in successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

module.exports = { registerUser, getAllUsers };

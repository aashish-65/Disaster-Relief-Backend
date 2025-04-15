const Ngo = require("../models/NgoModel");

const registerNgo = async (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    registrationNumber,
    password,
    description,
    website,
    location,
    resourcesProvided,
    profileImage,
  } = req.body;

  try {
    const newNgo = await Ngo.create({
      name,
      email,
      phone,
      address,
      registrationNumber,
      password,
      description,
      website,
      location,
      resourcesProvided,
      profileImage,
    });

    if (newNgo) {
      return res.status(201).json({ message: "User created successfully" });
    }
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).json({ error: firstError }); // "Email is required"
    }
    if (err.code === 11000 && err.keyValue.email) {
      return res
        .status(400)
        .json({ error: "Email with this user already exists" });
    }
    if (err.code === 11000 && err.keyValue.phone) {
      return res
        .status(400)
        .json({ error: "Phone Number with this user already exists" });
    }
    if (err.code === 11000 && err.keyValue.registrationNumber) {
      return res
        .status(400)
        .json({ error: "Government ID with this user already exists" });
    }
    return res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};

const getAllNgos = async (req, res) => {
  try {
    const users = await Ngo.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// const getNgoByLocation 

module.exports = { registerNgo, getAllNgos };

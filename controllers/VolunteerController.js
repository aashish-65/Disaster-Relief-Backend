const Volunteer = require("../models/VolunteerModel");

const registerVolunteer = async (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    password,
    location,
    profileImage,
    govId,
  } = req.body;

  try {
    const newVolunteer = await Volunteer.create({
      name,
      email,
      phone,
      address,
      password,
      location,
      profileImage,
      govId,
    });

    if (newVolunteer) {
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
        .json({ error: "Volunteer with this Email already exists" });
    }
    if (err.code === 11000 && err.keyValue.phone) {
      return res
        .status(400)
        .json({ error: "Volunteer with this Phone Number already exists" });
    }
    if (err.code === 11000 && err.keyValue.govId) {
      return res
        .status(400)
        .json({ error: "Volunteer with this Government ID already exists" });
    }
    return res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};

const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerVolunteer, getAllVolunteers };

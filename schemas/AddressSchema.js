const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  _id: false,
  line1: {
    type: String,
    required: [true, "Line 1 is required"],
    trim: true,
  },
  line2: {
    type: String,
    trim: true,
  },
  landmark: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true,
  },
  state: {
    type: String,
    required: [true, "State is required"],
    trim: true,
  },
  pinCode: {
    type: Number,
    required: [true, "Pin code is required"],
    match: [/^\d{6}$/, "Please enter a valid pin code"],
  },
});

module.exports = addressSchema;

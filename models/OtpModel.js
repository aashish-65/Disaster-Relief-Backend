const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  otp: {
    type: String,
    required: [true, "OTP is required"],
    match: [/^\d{6}$/, "OTP must be a 6-digit number"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

module.exports = mongoose.model("Otp", otpSchema);

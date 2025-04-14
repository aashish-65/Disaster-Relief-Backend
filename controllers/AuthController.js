const nodemailer = require("nodemailer");
const User = require("../models/UserModel");
const Otp = require("../models/OtpModel");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP required" });
  }

  try {
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    return res.status(200).json({ message: "OTP Verified Successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Error verifying OTP", error: err.message });
  }
};

const sendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const existingUser = await User.findOne(email);

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this Email already exists" });
    }
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const mailOptions = {
      from: `"SOS Service" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "SOS OTP Verification",
      text: `Your OTP is ${verificationCode}. It will expire in 10 minutes. If you did not request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);
    await Otp.create({ email, otp: verificationCode });
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

module.exports = {
  sendVerificationEmail,
  verifyOtp,
};

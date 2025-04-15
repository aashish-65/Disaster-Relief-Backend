const nodemailer = require("nodemailer");
const crypto = require('crypto');
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


const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }) || 
                 await Volunteer.findOne({ email }) || 
                 await Ngo.findOne({ email });
    
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000; // 1 hour
    
    await ResetToken.create({
      userId: user._id,
      token,
      expires
    });

    // Send email with reset link
    return res.status(200).json({ message: "Reset link sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const resetRecord = await ResetToken.findOne({ token });
    if (!resetRecord || Date.now() > resetRecord.expires) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(resetRecord.userId) ||
                 await Volunteer.findById(resetRecord.userId) ||
                 await Ngo.findById(resetRecord.userId);

    user.password = newPassword;
    await user.save();
    await ResetToken.deleteOne({ token });
    
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const unifiedLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password') ||
                 await Volunteer.findOne({ email }).select('+password') ||
                 await Ngo.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.constructor.modelName },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ token, role: user.constructor.modelName });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  sendVerificationEmail,
  verifyOtp,
  unifiedLogin,
  resetPassword,
  requestPasswordReset
};

const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const medicalReportSchema = require("../schemas/MedicalReportSchema")
const pointSchema = require("../schemas/PointSchema")
const addressSchema = require("../schemas/AddressSchema")
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^\d{10}$/, "Please enter a valid phone number"],
    },
    address: {
      type: addressSchema,
      required: [true, "Address is required"],
      _id: false
    },
    govId: {
      type: String,
      required: [true, "Government ID is required"],
      unique: true,
      match: [/^\d{12}$/, "Please enter a valid government ID"],
    },
    emergencyContact: {
      type: String,
      required: [true, "Emergency contact is required"],
      match: [/^\d{10}$/, "Please enter a valid emergency contact number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    medicalReport: {
      type: medicalReportSchema,
      required: [true, "Medical report is required"],
      _id: false
    },
    location: {
      type: pointSchema,
      required: [true, "Location is required"],
      index: "2dsphere",
      _id: false
    },
    rating: {
      type: Number,
      default: 5,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },
    profileImage: {
      type: String,
      required: [true, "Profile image is required"],
      default:
        "https://res.cloudinary.com/your-cloud/image/upload/default-profile.jpg",
      match: [/^https?:\/\/.+\..+/, "Invalid image URL"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User
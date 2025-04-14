// models/NgoModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const addressSchema = require("../schemas/AddressSchema");
const pointSchema = require("../schemas/PointSchema");

const ngoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
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
      _id: false,
    },
    registrationNumber: {
      type: String,
      required: [true, "Registration number is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+\..+/, "Invalid website URL"],
    },
    location: {
      type: pointSchema,
      required: [true, "Location is required"],
      index: "2dsphere",
      _id: false,
    },
    resourcesProvided: [
      {
        type: String,
        enum: [
          "food",
          "water",
          "medical",
          "shelter",
          "clothing",
          "fuel",
          "communication",
          "other",
        ],
        required: [true, "Resource type is required"],
      },
    ],
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    profileImage: {
      type: String,
      default:
        "https://res.cloudinary.com/your-cloud/image/upload/default-ngo.jpg",
      match: [/^https?:\/\/.+\..+/, "Invalid image URL"],
    },
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
ngoSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

ngoSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const NGO = mongoose.model("NGO", ngoSchema);
module.exports = NGO;

const mongoose = require("mongoose");

const medicalSchema = new mongoose.Schema(
  {
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },
    height: {
      type: Number,
      required: [true, "Height is required"],
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
      required: [true, "Blood group is required"],
    },
    allergies: {
      type: String,
      required: [true, "Allergies are required"],
    },
    medicalConditions: {
      type: String,
      required: [true, "Medical conditions are required"],
    },
    medications: {
      type: String,
      required: [true, "Medications are required"],
    },
    surgeries: {
      type: String,
      required: [true, "Surgeries are required"],
    },
    pregnancyStatus: {
        type: String,
        enum: ["pregnant", "not pregnant"],
        required: function() { 
          return this.gender === "female";
        },
        validate: {
          validator: (value) => {
            return ["pregnant", "not pregnant"].includes(value);
          },
          message: "Pregnancy status must be 'pregnant' or 'not pregnant'",
        },
      },
    }
  );

  module.exports = medicalSchema;
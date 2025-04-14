// models/ResourceModel.js
const mongoose = require("mongoose");
const pointSchema = require("../schemas/PointSchema");

// Define standard units for each resource type
const RESOURCE_UNITS = {
  food: "packets",
  water: "liters",
  medical: "kits",
  shelter: "people capacity",
  clothing: "sets",
  fuel: "liters",
  communication: "devices",
  other: "units",
};

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Resource name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    resourceType: {
      type: String,
      enum: Object.keys(RESOURCE_UNITS),
      required: [true, "Resource type is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    availableQuantity: {
      type: Number,
      required: [true, "Available quantity is required"],
      min: [0, "Available quantity cannot be negative"],
    },
    location: {
      type: pointSchema,
      required: [true, "Location is required"],
      index: "2dsphere",
    },
    providedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: [true, "Provider is required"],
      validate: {
        validator: async function (value) {
          const ngo = await mongoose.model("NGO").findById(value).exec();
          return ngo !== null; // Returns true if NGO exists
        },
        message: "Invalid NGO ID: No NGO found with this ID",
      },
    },
    contactPerson: {
      name: String,
      phone: String,
    },
    availableUntil: {
      type: Date,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual property to get the standard unit based on resource type
resourceSchema.virtual("unit").get(function () {
  return RESOURCE_UNITS[this.resourceType];
});

// Method to update available quantity
resourceSchema.methods.consumeResource = function (quantityToConsume) {
  if (this.availableQuantity >= quantityToConsume) {
    this.availableQuantity -= quantityToConsume;
    return true;
  }
  return false;
};

const Resource = mongoose.model("Resource", resourceSchema);
module.exports = Resource;

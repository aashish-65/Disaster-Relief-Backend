const mongoose = require("mongoose");
const pointSchema = require("../schemas/PointSchema");

const resourceRequestSchema = new mongoose.Schema({
  requestedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'requestedBy.userModel',
      required: true
    },
    userModel: {
      type: String,
      enum: ['User', 'Volunteer', 'NGO'],
      required: true
    }
  },
  relatedIncident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident'
  },
  resourceType: {
    type: String,
    enum: ["food", "water", "medical", "shelter", "clothing", "fuel", "communication", "other"],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"]
  },
  urgency: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium"
  },
  status: {
    type: String,
    enum: ["pending", "approved", "fulfilled", "rejected", "cancelled"],
    default: "pending"
  },
  location: {
    type: pointSchema,
    required: true,
    index: "2dsphere"
  },
  description: String,
  fulfilledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO'
  },
  fulfilledDate: Date,
  notes: String
}, {
  timestamps: true
});

// Method to update status
resourceRequestSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'fulfilled') {
    this.fulfilledDate = new Date();
  }
  return this.save();
};

const ResourceRequest = mongoose.model("ResourceRequest", resourceRequestSchema);
module.exports = ResourceRequest;
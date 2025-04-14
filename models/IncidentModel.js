const mongoose = require("mongoose");
const pointSchema = require("../schemas/PointSchema");
const addressSchema = require("../schemas/AddressSchema");

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Incident title is required"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  },
  incidentType: {
    type: String,
    enum: ["medical", "fire", "flood", "earthquake", "storm", "infrastructure", "security", "trapped", "other"],
    required: [true, "Incident type is required"]
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    required: [true, "Severity level is required"]
  },
  location: {
    type: pointSchema,
    required: [true, "Location is required"],
    index: "2dsphere"
  },
  address: {
    type: addressSchema,
    required: [true, "Address is required"],
    _id: false,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Reporter info is required"]
  },
  peopleAffected: {
    type: Number,
    default: 1,
    min: [0, "Number of affected people cannot be negative"]
  },
  resourcesNeeded: [{
    resourceType: {
      type: String,
      enum: ["food", "water", "medical", "shelter", "clothing", "fuel", "communication", "other"]
    },
    quantity: {
      type: Number,
      min: [1, "Quantity must be at least 1"]
    },
    details: String
  }],
  status: {
    type: String,
    enum: ["reported", "verified", "inProgress", "resolved", "closed", "falseAlarm"],
    default: "reported"
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  assignedTo: [{
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Volunteer'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["assigned", "accepted", "rejected", "completed"],
      default: "assigned"
    }
  }],
  managedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO'
  },
  media: [{
    type: {
      type: String,
      enum: ["image", "video", "audio"],
    },
    url: {
      type: String,
      match: [/^https?:\/\/.+\..+/, "Invalid media URL"]
    },
    caption: String
  }],
  notes: [{
    text: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'notes.addedByModel'
    },
    addedByModel: {
      type: String,
      enum: ['User', 'Volunteer', 'NGO']
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  resolvedAt: Date,
  estimatedResolutionTime: Date
}, {
  timestamps: true
});

// Calculate severity and priority based on various factors
incidentSchema.pre('save', function(next) {
  // If priority hasn't been manually set, calculate it based on severity and people affected
  if (this.isModified('severity') || this.isModified('peopleAffected')) {
    const severityWeight = {
      'low': 1,
      'medium': 3,
      'high': 7,
      'critical': 10
    };
    
    // Calculate priority (1-10 scale)
    // Formula: Base on severity, adjust by number of people affected
    let calculatedPriority = severityWeight[this.severity];
    
    // Adjust based on people affected
    if (this.peopleAffected > 10) {
      calculatedPriority += 2;
    } else if (this.peopleAffected > 5) {
      calculatedPriority += 1;
    }
    
    // Ensure priority is within range
    this.priority = Math.max(1, Math.min(10, calculatedPriority));
  }
  
  next();
});

// When incident is resolved, update resolvedAt
incidentSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'resolved' && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }
  next();
});

// Method to update status
incidentSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'resolved') {
    this.resolvedAt = new Date();
  }
  return this.save();
};

// Method to assign volunteer
incidentSchema.methods.assignVolunteer = function(volunteerId) {
  this.assignedTo.push({
    volunteer: volunteerId,
    assignedAt: new Date(),
    status: 'assigned'
  });
  return this.save();
};

// Method to add note
incidentSchema.methods.addNote = function(text, userId, userModel) {
  this.notes.push({
    text,
    addedBy: userId,
    addedByModel: userModel,
    addedAt: new Date()
  });
  return this.save();
};

// Setup indexes for efficient queries
incidentSchema.index({ status: 1, priority: -1 }); // For finding high priority active incidents
incidentSchema.index({ 'assignedTo.volunteer': 1, status: 1 }); // For finding incidents assigned to specific volunteer

const Incident = mongoose.model("Incident", incidentSchema);
module.exports = Incident;
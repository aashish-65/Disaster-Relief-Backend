/*
// Incident Management
POST /api/incidents                       - Report new incident
GET  /api/incidents                       - List incidents (with filters)
GET  /api/incidents/nearby                - Get nearby incidents
PUT  /api/incidents/:id                   - Update incident status
POST /api/incidents/:id/assign            - Assign volunteer to incident
POST /api/incidents/:id/complete          - Mark incident as resolved

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
}
*/

// const Incident = require("../models/IncidentModel");


// const reportIncident = async (req, res) => {
//     const { 
//         title, 
//         description, 
//         incidentType,
//         location, 
//         reportedBy,
//         severity,
//         address,

//      } = req.body;
    
    
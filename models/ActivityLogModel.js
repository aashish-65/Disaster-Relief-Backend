const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  actor: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'actor.userModel'
    },
    userModel: {
      type: String,
      enum: ['User', 'Volunteer', 'NGO', 'System']
    },
    name: String // Store name for quicker access and historical accuracy
  },
  action: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["incident", "resource", "user", "volunteer", "ngo", "admin", "system", "communication"],
    required: true
  },
  details: {
    type: mongoose.Schema.Schema.Types.Mixed, // Flexible field for additional details
    default: {}
  },
  target: {
    modelName: {
      type: String,
      enum: ['Incident', 'Resource', 'User', 'Volunteer', 'NGO', 'ResourceRequest', 'Task', 'Campaign', null],
      default: null
    },
    itemId: mongoose.Schema.Types.ObjectId,
    name: String // Name of target for easier reading
  },
  ipAddress: String,
  userAgent: String,
  status: {
    type: String,
    enum: ["success", "failure", "pending", "warning"],
    default: "success"
  },
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

// Create indexes for common queries
activityLogSchema.index({ "actor.userId": 1 });
activityLogSchema.index({ "target.itemId": 1 });
activityLogSchema.index({ createdAt: -1 }); // For timeline views
activityLogSchema.index({ category: 1, createdAt: -1 }); // For filtered views

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
module.exports = ActivityLog;
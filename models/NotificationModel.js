const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: {
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      refPath: 'recipient.userModel',
      required: true
    },
    userModel: {
      type: String,
      enum: ['User', 'Volunteer', 'NGO'],
      required: true
    }
  },
  type: {
    type: String,
    enum: ["emergency", "alert", "update", "assignment", "request", "system", "resource"],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  urgency: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium"
  },
  relatedTo: {
    modelName: {
      type: String,
      enum: ['Incident', 'Resource', 'ResourceRequest', 'Task', 'Campaign', null],
      default: null
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    }
  },
  action: {
    type: String, // URL or action identifier
    default: null
  },
  expiresAt: Date
}, {
  timestamps: true
});

// Add index for efficient querying of unread notifications
notificationSchema.index({ "recipient.userId": 1, "isRead": 1 });

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
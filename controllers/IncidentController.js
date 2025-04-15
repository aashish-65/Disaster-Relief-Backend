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

const Incident = require("../models/IncidentModel");


const reportIncident = async (req, res) => {
    const { 
        title, 
        description, 
        incidentType,
        severity,
        location, 
        address,
        reportedBy,
        peopleAffected,
        resourceNeeded,
        status,
        priority,     //to be discussed
        assignedTo,   //to be discussed
        managedBy,   //to be discussed
        media,       
        notes,        
     } = req.body;
    
    try {
        // Create a new incident instance
        const newIncident = new Incident({
            title,
            description,
            incidentType,
            severity,
            location,
            address,
            reportedBy,
            peopleAffected,
            resourceNeeded,
            status,
            priority,     //to be discussed
            assignedTo,   //to be discussed
            managedBy,   //to be discussed
            media,       
            notes,        
            isActive,   //to be discussed
        });
        
        await newIncident.save();
        
        return res.status(201).json({ message: "Incident reported successfully", incident: newIncident });
    }
    catch (err) {
        console.log("Error reporting incident:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
  }

  const listIncidents = async (req, res) => {
    const { status, severity, incidentType, location, dateRange } = req.query;
    
    try {
        // Build the filter object based on query parameters
        const filter = {};
        
        if (status) {
            filter.status = status;
        }
        if (severity) {
            filter.severity = severity;
        }
        if (incidentType) {
            filter.incidentType = incidentType;
        }
        if (location) {
            filter.location = location; // Assuming location is a point object
        }
        if (dateRange) {
            const [startDate, endDate] = dateRange.split(",");
            filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        
        const incidents = await Incident.find(filter).populate("reportedBy managedBy assignedTo");
        
        return res.status(200).json({ incidents });
    } catch (err) {
        console.log("Error listing incidents:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
  }

  const listNearByINcidents = async (req, res) => {
    const { latitude, longitude, radius } = req.body;

    try {
        const incidents = await Incident.find({
            location: {
                $near: {
                  $geomettry: {
                    type: "Point",
                    coordinates: [longitude, latitude] 
                },
                $maxDistance: radius * 1000||5000
              }
            },
            status: { $ne: "closed"||"resolved"||"falseAlarm" } // 
        }).populate("reportedBy managedBy assignedTo");

        return res.status(200).json({ incidents });
    }catch(err) {
        console.log("Error fetching nearby incidents:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
  }

  const updateIncidentStatus = async (req, res) => {
    const { id } = req.params;
    const { status, priority } = req.body; //to be discussed
    try {
        const incident = await Incident.findById({id}).populate("reportedBy managedBy assignedTo");
        if (!incident) {
            return res.status(404).json({ message: "Incident not found" });
        }
        incident.status = status || incident.status;
        incident.priority = priority || incident.priority; 
        await incident.save();
        return res.status(200).json({ message: "Incident status updated successfully", incident });
      }catch(err){
        console.log("Error updating incident status:", err.message);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
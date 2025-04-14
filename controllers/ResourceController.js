/*
POST /api/resources                       - Add new resource
GET  /api/resources                       - List available resources
GET  /api/resources/nearby                - Find nearby resources
POST /api/resources/request               - Request resources
POST /api/resources/donate                - Donate resources //to be done by cryptocurrency wallet
PUT  /api/resources/:id/allocate          - Allocate resources



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
*/

const Resource = require("../models/ResourceModel");

const addResource = async (req, res) => {
  const {
    name,
    description,
    resourceType,
    quantity,
    availableQuantity,
    location,
    providedBy,
    contactPerson,
    availableUntil,
  } = req.body;

  try {
    const resource = new Resource({
      name,
      description,
      resourceType,
      quantity,
      availableQuantity,
      location,
      providedBy,
      contactPerson,
      availableUntil,
    });

    await resource.save();

    return res.status(201).json({
      success: true,
      message: "Resource added successfully",
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).json({ error: firstError }); // "Email is required"
    }
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { addResource };
/*

// @desc    Get all resources with filtering
// @route   GET /api/resources
// @access  Public (or Protected based on your needs)
exports.getResources = async (req, res) => {
  try {
    // Build query based on filters
    const query = {};
    
    // Filter by resource type if provided
    if (req.query.resourceType) {
      query.resourceType = req.query.resourceType;
    }
    
    // Filter by minimum available quantity
    if (req.query.minAvailable) {
      query.availableQuantity = { $gte: parseInt(req.query.minAvailable) };
    }
    
    // Filter by NGO if provided
    if (req.query.providedBy) {
      query.providedBy = req.query.providedBy;
    }
    
    const resources = await Resource.find(query)
      .populate('providedBy', 'name logo')
      .sort('-lastUpdated');
    
    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
*/

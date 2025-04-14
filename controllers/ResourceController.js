/*
POST /api/resources                       - Add new resource done*
GET  /api/resources                       - List available resources
GET  /api/resources/nearby                - Find nearby resources
POST /api/resources/request               - Request resources
POST /api/resources/donate                - Donate resources //to be done by cryptocurrency wallet
PUT  /api/resources/:id/allocate          - Allocate resources
PUT /api/resources/requests/:requestId/status - Update resource request status

*/

const Resource = require("../models/ResourceModel");
const ResourceRequest = require("../models/ResourceRequestModel");

// Add new resource
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
      return res.status(400).json({ error: firstError });
    }
    return res.status(500).json({ error: err.message });
  }
};

// List all resources with filtering
const getResourcesByQuery = async (req, res) => {
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

    // Add filter for resources that haven't expired yet
    if (req.query.available !== "false") {
      query.$or = [
        { availableUntil: { $gt: new Date() } },
        { availableUntil: null },
      ];
    }

    const resources = await Resource.find(query)
      .populate("providedBy", "name email phone")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// Find nearby resources
const getNearbyResources = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance, resourceType } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: "Please provide longitude and latitude",
      });
    }

    // Convert distance to meters (default 10km if not provided)
    const distance = maxDistance ? parseInt(maxDistance) * 1000 : 10000;

    // Build geo query
    const query = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: distance,
        },
      },
      // Make sure available quantity is greater than 0
      availableQuantity: { $gt: 0 },
      // Only show resources that haven't expired
      $or: [{ availableUntil: { $gt: new Date() } }, { availableUntil: null }],
    };

    // Add resource type filter if provided
    if (resourceType) {
      query.resourceType = resourceType;
    }

    // Find resources
    const resources = await Resource.find(query)
      .populate("providedBy", "name email phone")
      .sort("location");

    // Calculate and add distance for each resource in km
    const resourcesWithDistance = resources.map((resource) => {
      const resourceObj = resource.toObject();
      // Calculate distance using Haversine formula
      const lon1 = parseFloat(longitude);
      const lat1 = parseFloat(latitude);
      const lon2 = resource.location.coordinates[0];
      const lat2 = resource.location.coordinates[1];

      const R = 6371; // Radius of earth in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km

      resourceObj.distance = distance.toFixed(2);//number to string with 2 decimal places
      return resourceObj;
    });

    res.status(200).json({
      success: true,
      count: resourcesWithDistance.length,
      data: resourcesWithDistance,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// Request resources
const requestResource = async (req, res) => {
  const {
    userId,
    userModel,
    resourceType,
    quantity,
    location,
    urgency,
    description,
    relatedIncident,
  } = req.body;

  try {
    // Validate input
    if (!userId || !userModel || !resourceType || !quantity || !location) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const resourceRequest = new ResourceRequest({
      requestedBy: {
        userId,
        userModel,
      },
      relatedIncident,
      resourceType,
      quantity,
      location,
      urgency: urgency || "medium",
      description: description || "",
      status: "pending",
    });

    await resourceRequest.save();

    // We might want to also create a notification here for available NGOs
    // That could be implemented separately or integrated here

    res.status(201).json({
      success: true,
      message: "Resource request submitted successfully",
      data: resourceRequest,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).json({
        success: false,
        error: firstError,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error submitting resource request",
      error: err.message,
    });
  }
};

/**
 * @route PUT /api/resources/:id/allocate
 * @desc Allocate resources based on approved resource requests
 * @access Private
 */
const allocateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { requestId } = req.body;
    
    // Validate input
    if (!requestId) {
      return res.status(400).json({ error: 'Resource request ID is required' });
    }
    
    // Fetch the resource from database
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    // Fetch the resource request
    const resourceRequest = await ResourceRequest.findById(requestId);
    if (!resourceRequest) {
      return res.status(404).json({ error: 'Resource request not found' });
    }
    
    // Validate request status - only approved requests can be allocated
    if (resourceRequest.status !== 'approved') {
      return res.status(400).json({ 
        error: 'Cannot allocate resources for non-approved requests',
        currentStatus: resourceRequest.status
      });
    }
    
    // Check if the request is for this specific resource
    if (resourceRequest.resourceId.toString() !== id) {
      return res.status(400).json({ 
        error: 'Resource request is not for this resource'
      });
    }
    
    // Check if resource has enough available quantity
    if (resource.availableQuantity < resourceRequest.quantity) {
      return res.status(400).json({ 
        error: 'Insufficient resource quantity',
        available: resource.availableQuantity,
        requested: resourceRequest.quantity
      });
    }
    
    // Update request status to allocated
    resourceRequest.status = 'allocated';
    resourceRequest.allocationDate = new Date();
    await resourceRequest.save();
    
    // Update resource availability
    resource.availableQuantity -= resourceRequest.quantity;
    resource.allocatedRequests = resource.allocatedRequests || [];
    resource.allocatedRequests.push(requestId);
    await resource.save();
    
    return res.status(200).json({
      message: 'Resource allocated successfully',
      request: resourceRequest,
      remainingQuantity: resource.availableQuantity
    });
    
  } catch (error) {
    console.error('Resource allocation error:', error);
    return res.status(500).json({ error: 'Server error during resource allocation' });
  }
};



module.exports = {
  addResource,
  getResourcesByQuery,
  getNearbyResources,
  requestResource,
  allocateResource,
};

/*
const resourcesWithDistance = resources.map(resource => {
    // Convert Mongoose document to plain object
    const resourceObj = resource.toObject();
    
    // Add custom field (distance) to the object
    resourceObj.distance = calculateDistance(...);
    
    return resourceObj;
});

Mongoose documents (query results) are not plain JavaScript objects — they contain additional Mongoose-specific 
properties/methods like _id, save(), isModified, etc. toObject() creates a clean object representation of the document.
*/

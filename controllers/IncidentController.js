/*
// Incident Management
POST /api/incidents                       - Report new incident
GET  /api/incidents                       - List incidents (with filters)
GET  /api/incidents/nearby                - Get nearby incidents
PUT  /api/incidents/:id                   - Update incident status
POST /api/incidents/:id/assign            - Assign volunteer to incident
POST /api/incidents/:id/complete          - Mark incident as resolved

*/

const Incident = require("../models/IncidentModel");


const createIncident = async (req, res) => {
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
            media,       
            notes,        
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
                  $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude] 
                },
                $maxDistance: (radius || 5) * 1000 
              }
            },
            status: { $nin: ["closed", "resolved", "falseAlarm"] } // 
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

    const completeIncident = async (req, res) => {
      const { id } = req.params;
      try {
        const incident = await Incident.findById(id);
        if (!incident) return res.status(404).json({ message: "Incident not found" });
        
        await incident.updateStatus('resolved');
        return res.status(200).json({ message: "Incident marked as resolved" });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    };
const logActivity = (category, action) => {
    return async (req, res, next) => {
      const originalSend = res.send;
      
      res.send = function(body) {
        const success = res.statusCode >= 200 && res.statusCode < 300;
        
        try {
          ActivityLog.create({
            actor: {
              userId: req.user._id,
              userModel: req.user.role,
              name: req.user.name
            },
            action: action,
            category: category,
            details: {
              requestBody: req.body,
              responseStatus: res.statusCode
            },
            target: req.params.id ? {
              modelName: category.charAt(0).toUpperCase() + category.slice(1),
              itemId: req.params.id
            } : null,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            status: success ? 'success' : 'failure'
          });
        } catch (err) {
          console.error('Activity logging error:', err);
        }
        
        originalSend.apply(res, arguments);
      };
      
      next();
    };
  };
  
  // Usage in routes
  router.post('/incidents', 
    auth, 
    logActivity('incident', 'create_incident'),
    incidentController.createIncident
  );

  /*
  {
  _id: "60a7b2e5c3e4f82d1c8b4567",
  actor: {
    userId: "60a7b2d5c3e4f82d1c8b4566",
    userModel: "NGO",
    name: "Red Cross Local Chapter"
  },
  action: "update_incident",
  category: "incident",
  details: {
    requestBody: {
      status: "inProgress",
      priority: 8
    },
    responseStatus: 200
  },
  target: {
    modelName: "Incident",
    itemId: "60a7b2c5c3e4f82d1c8b4565"
  },
  ipAddress: "192.168.1.105",
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...",
  status: "success",
  createdAt: "2023-05-21T14:32:05.123Z"
}
*/
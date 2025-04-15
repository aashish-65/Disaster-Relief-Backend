const router = require("express").Router();
const authController = require("../controllers/AuthController");
const userController = require("../controllers/UserController");
const volunteerController = require("../controllers/VolunteerController");
const ngoController = require("../controllers/NgoController");
const resourceController = require("../controllers/ResourceController");

// Authentication & User Management
router.post("/auth/verify-otp", authController.verifyOtp);
router.post("/auth/send-otp", authController.sendVerificationEmail);
router.post("/auth/user/register", userController.registerUser);
router.get("/auth/user/get-all-users", userController.getAllUsers);
router.post("/auth/volunteer/register", volunteerController.registerVolunteer);
router.get("/auth/user/get-all-volunteers",volunteerController.getAllVolunteers);
router.post("/auth/ngo/register", ngoController.registerNgo);
router.get("/auth/ngo/get-all-ngos", ngoController.getAllNgos);


/*addResource,
  getResourcesByQuery,
  getNearbyResources,
  requestResource,
  allocateResource,*/

// Resource Management
router.post("/resources", resourceController.addResource);
router.get("/resources", resourceController.getResourcesByQuery);
router.get("/resources/nearby", resourceController.getNearbyResources);
router.post("/resources/request", resourceController.requestResource);

module.exports = router;
/*


To implement:
// Incident Management
POST /api/incidents                       - Report new incident
GET  /api/incidents                       - List incidents (with filters)
GET  /api/incidents/nearby                - Get nearby incidents
PUT  /api/incidents/:id                   - Update incident status
POST /api/incidents/:id/assign            - Assign volunteer to incident
POST /api/incidents/:id/complete          - Mark incident as resolved

// Resource Management
POST /api/resources                       - Add new resource
GET  /api/resources                       - List available resources
GET  /api/resources/nearby                - Find nearby resources
POST /api/resources/request               - Request resources
POST /api/resources/donate                - Donate resources //to be done by cryptocurrency wallet
PUT  /api/resources/:id/allocate          - Allocate resources

// Volunteer Management
GET  /api/volunteers/available            - List available volunteers
POST /api/volunteers/assign               - Assign volunteer to task
PUT  /api/volunteers/:id/status           - Update volunteer status
GET  /api/volunteers/:id/history          - Get volunteer history

// NGO Management
GET  /api/ngos                            - List verified NGOs
GET  /api/ngos/:id/campaigns              - Get NGO's campaigns
POST /api/ngos/campaigns                  - Create relief campaign
PUT  /api/ngos/campaigns/:id              - Update campaign

// Communication
POST /api/notifications                   - Create notification
GET  /api/notifications                   - Get user's notifications
POST /api/messages                        - Send message
GET  /api/messages                        - Get conversation history

// Analytics & Reporting
GET  /api/analytics/impact                - Get disaster impact stats
GET  /api/analytics/response              - Get response effectiveness
GET  /api/reports/generate                - Generate custom report

*/

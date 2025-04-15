Hi, This is the Backend of Disaster Relief Crowdmapping.


# Resource Management API Documentation

This document outlines the API endpoints for managing resources in the SOS Service platform.

## Base URL

```
/api
```

## Authentication

All API requests require authentication using JWT token, except as noted.

## Resource Endpoints

### 1. Add New Resource

Create a new resource entry in the system.

**Endpoint**: `POST /api/resources`

**Auth Required**: Yes

**Request Body**:

```json
{
  "name": "Drinking Water",
  "description": "Bottled drinking water for emergency distribution",
  "resourceType": "water",
  "quantity": 1000,
  "availableQuantity": 1000,
  "location": {
    "type": "Point",
    "coordinates": [77.2090, 28.6139]
  },
  "providedBy": "60d7b3e5c3e4f82d1c8b4567",
  "contactPerson": {
    "name": "John Doe",
    "phone": "9876543210"
  },
  "availableUntil": "2025-05-30T00:00:00.000Z"
}
```

**Response (201 Created)**:

```json
{
  "success": true,
  "message": "Resource added successfully",
  "data": {
    "_id": "60d7b3e5c3e4f82d1c8b4568",
    "name": "Drinking Water",
    "description": "Bottled drinking water for emergency distribution",
    "resourceType": "water",
    "quantity": 1000,
    "availableQuantity": 1000,
    "location": {
      "type": "Point",
      "coordinates": [77.2090, 28.6139]
    },
    "providedBy": "60d7b3e5c3e4f82d1c8b4567",
    "contactPerson": {
      "name": "John Doe",
      "phone": "9876543210"
    },
    "availableUntil": "2025-05-30T00:00:00.000Z",
    "createdAt": "2025-04-14T18:30:00.000Z",
    "updatedAt": "2025-04-14T18:30:00.000Z"
  }
}
```

### 2. List Available Resources

Retrieve a list of available resources with optional filtering.

**Endpoint**: `GET /api/resources`

**Auth Required**: Yes

**Query Parameters**:

- `resourceType` (optional): Filter by resource type (food, water, medical, etc.)
- `minAvailable` (optional): Filter by minimum available quantity
- `providedBy` (optional): Filter by NGO ID
- `available` (optional): Set to 'false' to include expired resources

**Response (200 OK)**:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d7b3e5c3e4f82d1c8b4568",
      "name": "Drinking Water",
      "description": "Bottled drinking water for emergency distribution",
      "resourceType": "water",
      "quantity": 1000,
      "availableQuantity": 950,
      "location": {
        "type": "Point",
        "coordinates": [77.2090, 28.6139]
      },
      "providedBy": {
        "_id": "60d7b3e5c3e4f82d1c8b4567",
        "name": "Red Cross Local Chapter",
        "email": "redcross@example.com",
        "phone": "9876543210"
      },
      "contactPerson": {
        "name": "John Doe",
        "phone": "9876543210"
      },
      "availableUntil": "2025-05-30T00:00:00.000Z",
      "createdAt": "2025-04-14T18:30:00.000Z",
      "updatedAt": "2025-04-14T18:30:00.000Z"
    },
    {
      "_id": "60d7b3e5c3e4f82d1c8b4569",
      "name": "Food Packets",
      "description": "Ready-to-eat food packets",
      "resourceType": "food",
      "quantity": 500,
      "availableQuantity": 300,
      "location": {
        "type": "Point",
        "coordinates": [77.2090, 28.6139]
      },
      "providedBy": {
        "_id": "60d7b3e5c3e4f82d1c8b4567",
        "name": "Red Cross Local Chapter",
        "email": "redcross@example.com",
        "phone": "9876543210"
      },
      "contactPerson": {
        "name": "John Doe",
        "phone": "9876543210"
      },
      "availableUntil": "2025-05-30T00:00:00.000Z",
      "createdAt": "2025-04-14T18:30:00.000Z",
      "updatedAt": "2025-04-14T18:30:00.000Z"
    }
  ]
}
```

### 3. Find Nearby Resources

Find resources available near a specific location.

**Endpoint**: `GET /api/resources/nearby`

**Auth Required**: Yes

**Query Parameters**:

- `longitude` (required): Longitude coordinate
- `latitude` (required): Latitude coordinate
- `maxDistance` (optional): Maximum distance in kilometers (default: 10)
- `resourceType` (optional): Filter by resource type

**Response (200 OK)**:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d7b3e5c3e4f82d1c8b4568",
      "name": "Drinking Water",
      "description": "Bottled drinking water for emergency distribution",
      "resourceType": "water",
      "quantity": 1000,
      "availableQuantity": 950,
      "location": {
        "type": "Point",
        "coordinates": [77.2090, 28.6139]
      },
      "providedBy": {
        "_id": "60d7b3e5c3e4f82d1c8b4567",
        "name": "Red Cross Local Chapter",
        "email": "redcross@example.com",
        "phone": "9876543210"
      },
      "contactPerson": {
        "name": "John Doe",
        "phone": "9876543210"
      },
      "availableUntil": "2025-05-30T00:00:00.000Z",
      "distance": "2.45",
      "createdAt": "2025-04-14T18:30:00.000Z",
      "updatedAt": "2025-04-14T18:30:00.000Z"
    },
    {
      "_id": "60d7b3e5c3e4f82d1c8b4569",
      "name": "Medical Supplies",
      "description": "Basic first aid kits",
      "resourceType": "medical",
      "quantity": 200,
      "availableQuantity": 180,
      "location": {
        "type": "Point",
        "coordinates": [77.2099, 28.6150]
      },
      "providedBy": {
        "_id": "60d7b3e5c3e4f82d1c8b4570",
        "name": "Medical Relief NGO",
        "email": "medical@example.com",
        "phone": "9876543211"
      },
      "contactPerson": {
        "name": "Jane Smith",
        "phone": "9876543211"
      },
      "availableUntil": "2025-05-30T00:00:00.000Z",
      "distance": "3.12",
      "createdAt": "2025-04-14T18:30:00.000Z",
      "updatedAt": "2025-04-14T18:30:00.000Z"
    }
  ]
}
```

### 4. Request Resources

Submit a request for resources.

**Endpoint**: `POST /api/resources/request`

**Auth Required**: Yes

**Request Body**:

```json
{
  "userId": "60d7b3e5c3e4f82d1c8b4571",
  "userModel": "User",
  "resourceType": "water",
  "quantity": 50,
  "location": {
    "type": "Point",
    "coordinates": [77.2090, 28.6139]
  },
  "urgency": "high",
  "description": "Need drinking water for 50 people affected by building collapse",
  "relatedIncident": "60d7b3e5c3e4f82d1c8b4572"
}
```

**Response (201 Created)**:

```json
{
  "success": true,
  "message": "Resource request submitted successfully",
  "data": {
    "_id": "60d7b3e5c3e4f82d1c8b4573",
    "requestedBy": {
      "userId": "60d7b3e5c3e4f82d1c8b4571",
      "userModel": "User"
    },
    "relatedIncident": "60d7b3e5c3e4f82d1c8b4572",
    "resourceType": "water",
    "quantity": 50,
    "location": {
      "type": "Point",
      "coordinates": [77.2090, 28.6139]
    },
    "urgency": "high",
    "description": "Need drinking water for 50 people affected by building collapse",
    "status": "pending",
    "createdAt": "2025-04-14T18:30:00.000Z",
    "updatedAt": "2025-04-14T18:30:00.000Z"
  }
}
```

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**:
```json
{
  "success": false,
  "error": "Error message describing the validation issue"
}
```

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Invalid or missing authentication token"
}
```

**500 Server Error**:
```json
{
  "success": false,
  "message": "Server Error",
  "error": "Detailed error message"
}
```


src/
├── assets/
│   ├── images/
│   └── icons/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Footer.jsx
│   │   └── PageContainer.jsx
│   ├── maps/
│   │   ├── InteractiveMap.jsx
│   │   ├── LocationPicker.jsx
│   │   └── ClusterMap.jsx
│   ├── forms/
│   │   ├── AddressForm.jsx
│   │   ├── MedicalInfoForm.jsx
│   │   ├── LocationSelector.jsx
│   │   └── ResourceForm.jsx
│   ├── ui/
│   │   ├── IncidentCard.jsx
│   │   ├── ResourceCard.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── SeverityIndicator.jsx
│   │   ├── Modal.jsx
│   │   └── NotificationToast.jsx
│   ├── dashboard/
│   │   ├── StatCard.jsx
│   │   ├── ActivityTimeline.jsx
│   │   ├── Charts.jsx
│   │   └── RecentList.jsx
│   └── auth/
│       ├── OtpInput.jsx
│       └── RoleSelector.jsx
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── RegisterUser.jsx
│   │   ├── RegisterVolunteer.jsx
│   │   ├── RegisterNGO.jsx
│   │   └── OtpVerification.jsx
│   ├── dashboard/
│   │   ├── UserDashboard.jsx
│   │   ├── VolunteerDashboard.jsx
│   │   └── NgoDashboard.jsx
│   ├── incidents/
│   │   ├── ReportIncident.jsx
│   │   ├── IncidentList.jsx
│   │   ├── IncidentMap.jsx
│   │   ├── IncidentDetail.jsx
│   │   └── NearbyIncidents.jsx
│   ├── resources/
│   │   ├── AddResource.jsx
│   │   ├── ResourceList.jsx
│   │   ├── ResourceMap.jsx
│   │   ├── RequestResource.jsx
│   │   ├── ManageRequests.jsx
│   │   └── DonateResource.jsx
│   ├── profile/
│   │   ├── UserProfile.jsx
│   │   ├── VolunteerProfile.jsx
│   │   └── NgoProfile.jsx
│   └── analytics/
│       ├── ImpactStats.jsx
│       ├── ResponseEffectiveness.jsx
│       └── Reports.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useIncidents.js
│   ├── useResources.js
│   └── useGeolocation.js
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── incidentService.js
│   ├── resourceService.js
│   ├── userService.js
│   └── notificationService.js
├── utils/
│   ├── formatters.js
│   ├── validators.js
│   ├── mapHelpers.js
│   └── constants.js
├── context/
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── NotificationContext.jsx
├── App.jsx
├── main.jsx
└── index.css

Application Structure
Core Pages

Authentication Pages

Login Page
Register User Page (with different forms for Users, Volunteers, and NGOs)
OTP Verification Page


Dashboard Pages

User Dashboard
Volunteer Dashboard
NGO Dashboard
Admin Dashboard (if applicable)


Incident Management

Report Incident Page
Incident List/Map View
Incident Detail Page
Nearby Incidents Page


Resource Management

Add Resources Page (for NGOs)
Resource List/Map View
Request Resources Page
Resource Requests Management (for NGOs)



Profile Pages

User Profile
Volunteer Profile
NGO Profile


Analytics & Reporting

Impact Statistics Page
Response Effectiveness Page
Reports Page



Reusable Components

Layout Components

Navbar
Sidebar/Navigation
Footer
Page Container


Map Components

Interactive Map (for showing incidents and resources)
Location Picker (for reporting incidents and resources)
Cluster Map (for areas with multiple incidents)


Form Components

Input Fields (standardized for consistent UI)
Form Groups
Address Form (reused across user, volunteer, and incident registration)
Location Selector
Resource Selection


UI Components

Incident Card
Resource Card
Status Badge (for incident/request status)
Severity Indicator
Modal
Notification Toast
Skeleton Loaders
Pagination Controls


Dashboard Components

Stat Cards
Activity Timeline
Charts and Graphs
Recent Incidents List
Nearby Resources List


Authentication Components

OTP Input
Role Selector
# EcoPulse Backend API Documentation## Overview
Backend service for the EcoPulse waste management system that handles team management, task assignments, and waste reports.

## Project Structure
```
backend/
├── config/
│   └── db.js              # Database configuration
├── middleware/
│   ├── auth.js            # Authentication middleware
│   └── rateLimiter.js     # Rate limiting middleware
├── models/
│   ├── Notification.js    # Notification schema
│   ├── Report.js          # Report schema
│   ├── Task.js            # Task schema
│   ├── Team.js            # Team schema
│   └── User.js            # User schema
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── map.js            # Map location routes
│   ├── notifications.js   # Notification routes
│   ├── reports.js        # Report handling routes
│   ├── stats.js          # Statistics routes
│   ├── tasks.js          # Task management routes
│   ├── teams.js          # Team management routes
│   └── upload.js         # File upload routes
├── .env                  # Environment variables
├── .env.example          # Example environment variables
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies
└── server.js           # Main application entry point
```

## Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file based on `.env.example`:
```properties
PORT=3001
MONGO_URI=mongodb://localhost:27017/ecopulse
JWT_SECRET=your_secret_key_here
```

### Running the Server
Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create new team

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks/assign` - Assign task to team
- `PUT /api/tasks/:id/complete` - Mark task as complete

### Reports
- `POST /api/report-dump` - Submit new dump report
- `GET /api/dump-reports` - Get all dump reports

### Map
- `GET /api/map/locations` - Get all location markers

### Notifications
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications` - Create new notification

### Statistics
- `GET /api/stats` - Get system statistics

### File Upload
- `POST /api/upload` - Upload files

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Models

### User
- email: String
- password: String
- role: String

### Team
- name: String
- phone: String
- location: String
- status: String (ASSIGNED/NOT ASSIGNED)
- date: Date

### Task
- location: String
- type: String
- color: String
- timestamp: Date
- assigned: Boolean
- completed: Boolean
- team: Reference to Team
- deadline: Date
- description: String

### Report
- name: String
- location: String
- description: String
- contactInfo: String
- timeReported: Date

### Notification
- message: String
- timestamp: Date
- type: String

## Error Handling
The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Rate Limiting
API requests are rate-limited to 100 requests per 15 minutes per IP address.

## Dependencies
- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing
- cors: Cross-origin resource sharing
- dotenv: Environment variable management
- multer: File upload handling
- express-rate-limit: Rate limiting

## Authentication
### Login
- **Path:** `/auth/login`
- **Method:** POST
- **Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "string",
    "email": "string",
    "role": "string"
  }
}
```

### Get Profile 
- **Path:** `/auth/profile`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "id": "string",
  "email": "string",
  "role": "string"
}
```

## Teams
### Get All Teams
- **Path:** `/teams`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "phone": "string",
    "location": "string",
    "status": "ASSIGNED" | "NOT ASSIGNED",
    "date": "date"
  }
]
```

### Create Team
- **Path:** `/teams`
- **Method:** POST
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "name": "string",
  "phone": "string",
  "location": "string",
  "status": "ASSIGNED" | "NOT ASSIGNED"
}
```

## Tasks
### Get All Tasks
- **Path:** `/tasks`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
[
  {
    "id": "string",
    "location": "string",
    "type": "string",
    "color": "string",
    "timestamp": "date",
    "assigned": "boolean",
    "completed": "boolean",
    "team": "Team object",
    "deadline": "date",
    "description": "string"
  }
]
```

### Assign Task
- **Path:** `/tasks/assign`
- **Method:** POST
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "taskId": "string",
  "teamId": "string",
  "deadline": "date"
}
```

### Complete Task
- **Path:** `/tasks/:id/complete`
- **Method:** PUT
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Updated task object

## Reports
### Submit Dump Report
- **Path:** `/report-dump`
- **Method:** POST
- **Request Body:**
```json
{
  "name": "string",
  "location": "string",
  "description": "string",
  "contactInfo": "string"
}
```

### Get All Reports
- **Path:** `/dump-reports`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "location": "string",
    "description": "string",
    "contactInfo": "string",
    "timeReported": "date"
  }
]
```

## Map
### Get Location Markers
- **Path:** `/map/locations`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
[
  {
    "name": "string",
    "lat": "number",
    "lon": "number",
    "status": "COMPLETED" | "PENDING",
    "teamAssigned": "boolean",
    "time": "date"
  }
]
```

## Notifications
### Get All Notifications
- **Path:** `/notifications`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
[
  {
    "id": "string",
    "message": "string",
    "timestamp": "date",
    "type": "string"
  }
]
```

### Create Notification
- **Path:** `/notifications`
- **Method:** POST
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "message": "string",
  "type": "string"
}
```

## Statistics
### Get System Stats
- **Path:** `/stats`
- **Method:** GET
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "totalTasks": "number",
  "completedTasks": "number",
  "activeTeams": "number",
  "pendingReports": "number"
}
```

## File Upload
### Upload File
- **Path:** `/upload`
- **Method:** POST
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Request Body:**
```form-data
file: (binary)
```
- **Response:**
```json
{
  "fileUrl": "string"
}
```

## Error Responses
All endpoints may return these error responses:

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden"
}
```

### 400 Bad Request
```json
{
  "message": "Error description"
}
```

### 500 Server Error
```json
{
  "message": "Internal server error"
}
```
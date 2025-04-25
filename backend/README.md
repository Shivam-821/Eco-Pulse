routes.md

# API Routes Documentation

This document covers all the available routes in the backend, what they do, which data to send, and the expected responses.

---

## Base URL
All endpoints are prefixed with the base URL (e.g., `http://localhost:3001/api/`).

---

## Authentication Routes

### Register
- **Endpoint:** `POST /api/auth/signup`
- **Description:** signup of a new user.
- - **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "user_password"
  }
  ```
- **Success Response:**
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "607d1b2f5e3c1a0015c9d212",
      "fullname": "John Doe",
      "avatar": "https://res.cloudinary.com/your_cloud_name/image/upload/v1626841234/1600000000000-avatar.jpg",
      "email": "johndoe@example.com",
      "username": "johndoe",
      "dumpRegistered": []
    },
    "message": "User registered successfully",
    "success": true
  }
  
  ```

- **Error Responses:**  
  - 401: Invalid credentials  
  - 404: User not found
### Login
- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticate a user.
- **Request Header:**  
  `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "user_password"
  }
  ```
- **Success Response:**
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "user" // or admin role etc.
    }
  }
  ```
- **Error Responses:**  
  - 401: Invalid credentials  
  - 404: User not found

### Get Profile
- **Endpoint:** `GET /api/auth/profile`
- **Description:** Get details of the authenticated user.
- **Request Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Success Response:**
  ```json
  {
    "id": "user_id",
    "email": "user@example.com",
    "role": "user"
  }
  ```
- **Error Responses:**  
  - 401: Unauthorized  
  - 404: User not found

---

## Team Routes

### Get All Teams
- **Endpoint:** `GET /api/teams`
- **Description:** Returns a list of all teams (requires admin authentication).
- **Request Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Success Response:**
  ```json
  [
    {
      "_id": "team_id",
      "teamname": "Team A",
      "location": { "type": "Point", "coordinates": [longitude, latitude] },
      "email": "teama@example.com",
      "assignedWork": []
    },
    { ... }
  ]
  ```
- **Error Responses:**  
  - 500: Failed to fetch teams

### Create New Team
- **Endpoint:** `POST /api/teams`
- **Description:** Create a new team (admin only).
- **Request Headers:**
  - `Authorization: Bearer <jwt_token>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "teamname": "Team A",
    "email": "teama@example.com",
    "location": {
      "type": "Point",
      "coordinates": [longitude, latitude]
    },
    "password": "team_password"
  }
  ```
- **Success Response:**
  ```json
  {
    "_id": "team_id",
    "teamname": "Team A",
    "email": "teama@example.com",
    "location": { "type": "Point", "coordinates": [longitude, latitude] },
    "assignedWork": []
  }
  ```
- **Error Responses:**  
  - 500: Failed to create team

---

## Task Routes

### Get All Tasks
- **Endpoint:** `GET /api/tasks`
- **Description:** Retrieve tasks; each task populates the assigned team details.
- **Request Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Success Response:**
  ```json
  [
    {
      "_id": "task_id",
      "title": "Task Title",
      "description": "Task description",
      "assignedTo": { "_id": "team_id", "teamname": "Team A" },
      "status": "PENDING", // or IN_PROGRESS, COMPLETED, CANCELLED
      "priority": "MEDIUM",
      "dueDate": "2025-04-30T00:00:00.000Z",
      "location": {
        "type": "Point",
        "coordinates": [longitude, latitude],
        "address": "Address string"
      },
      "createdAt": "2025-04-25T00:00:00.000Z"
    },
    { ... }
  ]
  ```
- **Error Responses:**
  - 500: Failed to fetch tasks

### Assign Task to a Team
- **Endpoint:** `POST /api/tasks/assign`
- **Description:** Assign a task to a team (admin only).
- **Request Headers:**
  - `Authorization: Bearer <jwt_token>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "taskId": "task_id",
    "teamId": "team_id",
    "deadline": "2025-05-01T00:00:00.000Z"
  }
  ```
- **Success Response:** Returns the updated task.
  ```json
  {
    "_id": "task_id",
    "assignedTo": "team_id",
    "assigned": true,
    "deadline": "2025-05-01T00:00:00.000Z",
    ...
  }
  ```
- **Error Responses:**
  - 500: Failed to assign task

### Mark Task as Complete
- **Endpoint:** `PUT /api/tasks/:id/complete`
- **Description:** Mark a task as complete.
- **Request Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Success Response:** Returns the updated task.
  ```json
  {
    "_id": "task_id",
    "completed": true,
    ...
  }
  ```
- **Error Responses:**
  - 500: Failed to update task

---

## Report Routes

### Submit Dump Report
- **Endpoint:** `POST /api/report-dump`
- **Description:** Submit a new dump report. This route uses file uploads.
- **Request Headers:**
  - `Content-Type: multipart/form-data`
  - Optionally `Authorization: Bearer <jwt_token>` if authentication is required.
- **Request Body (Form Data):**
  - `location`: coordinates or address string.
  - `description`: details about the dump.
  - `image`: the file being uploaded.
- **Processing:**
  - The `uploadMiddleware` handles file upload.
  - `processImage` resizes and converts the image.
- **Success Response:**
  ```json
  {
    "message": "Reported successfully",
    "dump": {
      "_id": "dump_id",
      "location": "...",
      "description": "Dump description",
      "picture": "uploads/1600000000000-filename.jpg",
      "createdAt": "2025-04-25T00:00:00.000Z"
    }
  }
  ```
- **Error Responses:**
  - 500: Failed to report dump

### Get All Dump Reports
- **Endpoint:** `GET /api/dump-reports`
- **Description:** Retrieve all dump reports (admin only, if protected by middleware).
- **Request Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Success Response:**
  ```json
  [
    {
      "_id": "dump_id",
      "location": { ... },
      "description": "Dump description",
      "picture": "uploads/filename.jpg",
      "createdAt": "2025-04-25T00:00:00.000Z"
    },
    { ... }
  ]
  ```
- **Error Responses:**
  - 500: Failed to fetch dump reports

---

## Map Routes

### Get Location Markers
- **Endpoint:** `GET /api/map/locations`
- **Description:** Retrieves markers built from task data. Each marker contains:
  - `name`: Task description
  - `lat` and `lon`: Coordinates from the task’s location
  - `status`: "COMPLETED" or "PENDING"
  - `teamAssigned`: Boolean indicating if the task is assigned
  - `time`: Task createdAt timestamp
- **Request Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Success Response:**
  ```json
  [
    {
      "name": "Fix leak",
      "lat": 12.9716,
      "lon": 77.5946,
      "status": "PENDING",
      "teamAssigned": false,
      "time": "2025-04-25T00:00:00.000Z"
    },
    { ... }
  ]
  ```
- **Error Responses:**
  - 500: Failed to fetch markers

---

## Notification Routes

### Get Notifications
- **Endpoint:** `GET /api/notifications`
- **Description:** Retrieve notifications. Accessible by any authenticated user.
- **Request Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Success Response:**
  ```json
  [
    {
      "_id": "notif_id",
      "title": "Alert",
      "message": "Service disruption",
      "type": "ALERT",
      "read": false,
      "createdAt": "2025-04-25T00:00:00.000Z"
    },
    { ... }
  ]
  ```
- **Error Responses:**
  - 500: Failed to fetch notifications

### Create Notification
- **Endpoint:** `POST /api/notifications`
- **Description:** Create a new notification (admin only).
- **Request Headers:**
  - `Authorization: Bearer <jwt_token>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "title": "Info",
    "message": "New update available",
    "type": "INFO"
  }
  ```
- **Success Response:**
  ```json
  {
    "_id": "notif_id",
    "title": "Info",
    "message": "New update available",
    "type": "INFO",
    "read": false,
    "createdAt": "2025-04-25T00:00:00.000Z"
  }
  ```
- **Error Responses:**
  - 500: Failed to create notification

---

## Statistics Routes

### Get System Statistics
- **Endpoint:** `GET /api/stats`
- **Description:** Returns system stats.
- **Request Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Success Response:**
  ```json
  {
    "totalTasks": 100,
    "completedTasks": 60,
    "activeTeams": 10,
    "pendingReports": 5 
  }
  ```
- **Error Responses:**
  - 500: Failed to fetch stats

---

## File Upload Route

### Upload File
- **Endpoint:** `POST /api/upload`
- **Description:** Uploads a file and processes the image.
- **Request Headers:**
  - `Authorization: Bearer <jwt_token>`
  - `Content-Type: multipart/form-data`
- **Request Body (Form Data):**
  - Key: `image`
  - Value: (binary file)
- **Processing:**
  - `uploadMiddleware` handles the file upload.
  - `processImage` resizes and compresses the image.
- **Success Response:**
  ```json
  {
    "fileUrl": "uploads/1600000000000-filename.jpg"
  }
  ```
- **Error Responses:**
  - 500: Failed to process image

---

## Notes
- **Authentication:** Most routes require an `Authorization` header with a valid JWT.
- **Error Format:** In case of errors, expected responses include a JSON with an error message and appropriate HTTP status code.
- **File Uploads:** Images are processed using Sharp; processed files are stored in the `uploads/` directory.
- **Data Validation:** Required fields must be provided as mentioned in each endpoint’s request body.

---

This documentation should guide frontend developers on how to interact with the API endpoints. For any clarification, please refer to our README or contact the backend team.
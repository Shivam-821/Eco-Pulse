# 🌍 EcoPulse

**Smart Waste Management Platform for a Cleaner & Greener Future**

EcoPulse is a full-stack platform that optimizes waste collection, recycling, and reporting.  
It provides **real-time dashboards** for admins, cleaning teams, and recycling units, ensuring transparency and efficiency across the waste lifecycle.

---

## 📂 Project Structure

```bash
Eco-Pulse
├──backend
    ├── .env.example
    ├── .gitignore
    ├── README.md
    ├── config
    │   └── db.js
    ├── controllers
    │   ├── Complain.controller.js
    │   ├── admin.controller.js
    │   ├── assignTeam.controller.js
    │   ├── assignedTask.controller.js
    │   ├── nearbyBin.controller.js
    │   ├── recycle.controller.js
    │   ├── registerDump.controller.js
    │   ├── stats.controller.js
    │   ├── twilio.controller.js
    │   └── user.controller.js
    ├── middleware
    │   ├── auth.middleware.js
    │   ├── index.js
    │   ├── multer.middleware.js
    │   ├── rateLimiter.js
    │   ├── role.middleware.js
    │   └── upload.middleware.js
    ├── models
    │   ├── SmartBin.model.js
    │   ├── admin.model.js
    │   ├── assignTeam.model.js
    │   ├── event.model.js
    │   ├── generalComplaint.model.js
    │   ├── index.js
    │   ├── maintenance.model.js
    │   ├── notification.model.js
    │   ├── recycle.model.js
    │   ├── registerDump.model.js
    │   ├── task.model.js
    │   └── user.model.js
    ├── package-lock.json
    ├── package.json
    ├── routes
    │   ├── assignedTask.route.js
    │   ├── auth.route.js
    │   ├── complain.routes.js
    │   ├── dumps.routes.js
    │   ├── edit.md
    │   ├── index.js
    │   ├── map.js
    │   ├── nearbyBin.routes.js
    │   ├── notifications.js
    │   ├── recycle.routes.js
    │   ├── reports.js
    │   ├── stats.route.js
    │   ├── tasks.route.js
    │   ├── teams.js
    │   └── upload.js
    ├── server.js
    └── utils
    │   ├── ApiError.js
    │   ├── ApiResponse.js
    │   ├── asyncHandler.js
    │   ├── cloudinary.js
    │   ├── otpverify.js
    │   └── twilio.js

├── frontend
    ├── .env
    ├── .env.sample
    ├── .gitignore
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── public
        └── eco_logo.png
    ├── src
        ├── App.css
        ├── App.jsx
        ├── components
        │   ├── Complaint.jsx
        │   ├── DarkMode.jsx
        │   ├── Footer.jsx
        │   ├── Map.jsx
        │   ├── Navbar.jsx
        │   ├── Notifications.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── ReportDumpForm.jsx
        │   ├── Sidebar.jsx
        │   ├── Tasks.jsx
        │   └── Teams.jsx
        ├── index.css
        ├── main.jsx
        └── pages
        │   ├── About .jsx
        │   ├── AssignedTask.jsx
        │   ├── Auth.jsx
        │   ├── Complain.jsx
        │   ├── Home.jsx
        │   ├── RegisterRecycle.jsx
        │   ├── StatsDashboardPage.jsx
        │   ├── ViewAllRecycle.jsx
        │   └── index.js
    ├── vercel.json
    └── vite.config.js
```

---

## 🚀 Features

- ⚡**Interactive Dashboards** – Dumps, collection schedules, complain lodge & recycling analytics
- 🛠️ **Role-Based Access** – Admin, Cleaning Teams, User
- 🔔 **Smart Alerts** – Notifications on collection & missed pickups (via Twilio)
- 📊 **Real Time Analysis** – real time analysis of all dump, collection and recycling activity.
- ♻️ **Recycling Insights** – Track processed vs. recycled waste
- 📱 **Modern Web App** – Responsive, fast & intuitive design

---

## 🏗️ Tech Stack

**Frontend**

- React.js
- Axios (API calls)
- Recharts (data visualization)

**Backend**

- Express.js (MVC REST API)
- MongoDB (DataBase)
- Twilio (SMS/alerts)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Shivam-821/Eco-Pulse.git
cd Eco-Pulse
```

### 2️⃣ Backend Setup

```bash
cd backend
cp .env.example .env   # add your configs
npm install
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌱 Vision

EcoPulse empowers cities, institutions & communities to adopt sustainable practices, reduce landfill overflow, and achieve smarter waste management through data-driven insights.

---

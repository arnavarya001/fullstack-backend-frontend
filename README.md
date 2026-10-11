# 🚗 Vehicle Management System (VMS)
A full-stack MERN application built for tracking, managing, and monitoring vehicle records, insurance validity, and operational statuses with strict Role-Based Access Control (Admin & User).

---

## 📌 Deployment Links

- **Frontend (Vercel):** [https://vehicle-management-system-frontend.vercel.app](https://your-frontend-url.vercel.app)
- **Backend (Render / Railway):** [https://vehicle-management-system-api.onrender.com](https://your-backend-url.onrender.com)
- **GitHub Repository:** [https://github.com/your-username/vehicle-management-system](https://github.com/kjaid0341-creator/VEHICLE-MANAGEMENT-)

---

## 👥 Team Information

- **Team Name:** [NEURAL NEXUS]
- **Project Name:** Vehicle Management System (Project ID: 13)

| Role | Name | Roll Number | GitHub Handle |
| :--- | :--- | :--- | :--- |
| **Team Lead** | SAFAK ALI | 2025-AI/ML-01 | [@teamlead-github](https://github.com/kjaid0341-creator) |
| **Member 1** | DEBOJIT DEY | 2025-AI/ML-02 | [@member1-github](https://github.com/debojitdey037) |
| **Member 2** | ARNAV ARYA | 2025-AI/ML-03 | [@member2-github](https://github.com/arnavarya001) |

---

## 📖 Project Description

The **Vehicle Management System** streamlines vehicle fleet tracking, maintenance scheduling, and insurance oversight. It provides real-time client-side rendering with React and Vite backed by a secure RESTful API built on Node.js, Express, and MongoDB Atlas. 

The application implements Role-Based Access Control (RBAC):
- **Admin:** Has full privileges to create, inspect, update, and remove vehicle records, track insurance expirations, and change operational statuses.
- **User:** Can view the active vehicle fleet and filter/search by registration number, model, type, or status.

---

## ✨ Features

- **Authentication & Authorization:** Secure registration and login using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Role-Based Access Control (RBAC):** Distinct interfaces and protected API routes for `Admin` and `User`.
- **Full CRUD Operations:** 
  - Add new vehicles with validation
  - Browse fleet list with real-time search & filters (by type, model, status)
  - Edit vehicle details & insurance expiry date
  - Delete decommissioned vehicles (Admin only)
- **Status & Expiry Tracking:** Visual badges for vehicle statuses (`Active`, `Under Maintenance`, `Inactive`) and warnings for expired insurance.
- **Responsive UI:** Clean, intuitive UI built with React, modular CSS, and controlled form inputs.
- **Error Handling & Feedback:** Client-side form validation, toast notifications, and centralized backend error handling.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (via Vite)
- **Routing:** React Router v6+
- **State & Lifecycle:** `useState`, `useEffect`
- **HTTP Client:** Axios / Fetch API
- **Styling:** CSS Modules / Modern CSS

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas via Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Middleware:** CORS, Express JSON parser, RBAC guards

---

## 🗄️ Database Schema (`Vehicle`)

```javascript
{
  vehicleNumber: { type: String, required: true, unique: true, uppercase: true }, // e.g., "ABC-1234"
  model:         { type: String, required: true },                               // e.g., "Toyota Corolla"
  type:          { type: String, enum: ['Sedan', 'SUV', 'Truck', 'Van', 'Bike'], required: true },
  owner:         { type: String, required: true },                               // e.g., "Logistics Dept / Fleet A"
  insuranceExpiry: { type: Date, required: true },
  status:        { type: String, enum: ['Active', 'Maintenance', 'Inactive'], default: 'Active' },
  createdAt:     { type: Date, default: Date.now }
}
```

---

## 🔌 API Endpoints

### 🔐 Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user / admin account |
| `POST` | `/api/auth/login` | Public | Authenticate user and return JWT token |

### 🚗 Vehicle Routes (`/api/vehicles`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/vehicles` | User / Admin | Retrieve all vehicles (supports query filters) |
| `GET` | `/api/vehicles/:id` | User / Admin | Retrieve details of a single vehicle |
| `POST` | `/api/vehicles` | **Admin Only** | Add a new vehicle to the registry |
| `PUT` | `/api/vehicles/:id` | **Admin Only** | Update an existing vehicle's record |
| `DELETE` | `/api/vehicles/:id` | **Admin Only** | Delete a vehicle record |

---

## 📂 Project Directory Structure

```text
vehicle-management-system/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Modal, Cards)
│   │   ├── pages/              # Views (Dashboard, Login, Register, VehicleDetails)
│   │   ├── services/           # Axios / API request instances
│   │   ├── hooks/              # Custom React hooks (useAuth, useFetch)
│   │   ├── App.jsx             # Main Router configuration
│   │   ├── main.jsx            # React root DOM mount
│   │   └── index.css           # Global stylesheet
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── config/             # DB connection (db.js)
│   │   ├── controllers/        # Request handlers (authController, vehicleController)
│   │   ├── middleware/         # authenticateUser, requireAdmin, errorHandler
│   │   ├── models/             # Mongoose schemas (User.js, Vehicle.js)
│   │   ├── routes/             # Route definitions (authRoutes, vehicleRoutes)
│   │   ├── utils/              # Token generators and helpers
│   │   └── server.js           # Server entry point
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vehicle_management?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Note:** Never commit `.env` to Git. Keep template copies in `.env.example`.

---

## 🚀 Setup & Local Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas cluster account or local MongoDB instance
- Git installed on your machine

### 1. Clone Repository
```bash
git clone https://github.com/your-username/vehicle-management-system.git
cd vehicle-management-system
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment configuration
cp .env.example .env
# Edit .env with your MongoDB Atlas URI and JWT Secret

# Start development server
npm run dev
# Server will run at http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install

# Create environment configuration
cp .env.example .env
# Ensure VITE_API_URL points to http://localhost:5000/api

# Start client development server
npm run dev
# Frontend will run at http://localhost:5173
```

---

## 🌿 Git Team Workflow & Contribution Rules

To comply with the assignment guidelines, team members must adhere to the following workflow:

1. **No direct commits to `main`**: All features must go through Pull Requests.
2. **Branch Naming Standard**:
   - `feature/auth` — Authentication & JWT handling
   - `feature/vehicle-crud` — Vehicle model, controller, and CRUD API
   - `feature/admin-dashboard` — Frontend Admin management console
   - `feature/user-fleet-view` — Frontend search/filter vehicles page
   - `feature/middleware-security` — RBAC middleware & validations
3. **Workflow Steps**:
   ```bash
   git checkout -b feature/your-feature-name
   # Make your changes
   git add .
   git commit -m "feat: implement vehicle update controller"
   git push origin feature/your-feature-name
   ```
4. **Pull Requests**:
   - Open a PR targeting `main`.
   - Team Lead reviews the code and merges.
   - **Grading Requirement:** Every member must have at least **2 meaningful merged PRs**.

---

## 📄 License
This project is submitted as coursework for **Assignment 4 (CRUD - Client Side Rendering)**.

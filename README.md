# 🚗 Ridenest: Ride Booking API

A modular RESTful API for managing ride requests, built with Express.js, TypeScript, Mongoose, Zod, and Passport.js.

---

## ⚙️ Technology Stack

- **Express.js** – Node.js web framework
- **TypeScript** – Type-safe JavaScript
- **MongoDB + Mongoose** – NoSQL database with ODM
- **Zod** – Schema validation
- **Passport.js** – Authentication (Email/Password + Google)
- **JWT** – Secure token-based authentication
- **CORS** – Cross-Origin Resource Sharing
- **Dotenv** – Environment configuration

---

## 🚀 Installation & Setup

Clone the repository:

```bash
git clone https://github.com/simantabarua/RideNest-api.git
cd RideNest-api
npm install
```

Create a `.env` file in the root directory with the following variables:

```env

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

DB_URL=db_url

JWT_ACCESS_SECRET=access_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=refresh_secret
JWT_REFRESH_EXPIRES=7d

BCRYPT_SALT_ROUND=10

SUPER_ADMIN_EMAIL=super@mail.com
SUPER_ADMIN_PASSWORD=Super@123


GOOGLE_CLIENT_ID=google_client_id
GOOGLE_CLIENT_SECRET=google_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/

EXPRESS_SESSION_SECRET=express-session

```

Start the development server:

```bash
npm run dev
```

---

## 📘 API Endpoints

### 🔐 Authentication

| Method | Endpoint                     | Description                                |
| ------ | ---------------------------- | ------------------------------------------ |
| POST   | /api/v1/users/register       | Register a new user (Rider, Driver, Admin) |
| POST   | /api/v1/auth/login           | Login with email and password              |
| POST   | /api/v1/auth/refresh-token   | Refresh JWT tokens                         |
| POST   | /api/v1/auth/logout          | Clear cookies and logout                   |
| PATCH  | /api/v1/auth/change-password | Change a user's password                   |
| GET    | /api/v1/auth/google          | Initiate Google OAuth                      |
| GET    | /api/v1/auth/google/callback | Google OAuth callback endpoint             |

---

### 👤 User Management

| Method | Endpoint                | Description                          |
| ------ | ----------------------- | ------------------------------------ |
| GET    | /api/v1/users/me        | Get current user's profile           |
| PATCH  | /api/v1/users/update    | Update current user's profile        |
| GET    | /api/v1/admin/users     | Get all users (Admin only)           |
| PATCH  | /api/v1/admin/users/:id | Update a user's profile (Admin only) |
| DELETE | /api/v1/admin/users/:id | Delete a user (Admin only)           |

---

### 🚕 Driver Management

| Method | Endpoint                     | Description                          |
| ------ | ---------------------------- | ------------------------------------ |
| GET    | /api/v1/drivers/earnings     | Get a driver's earnings              |
| PATCH  | /api/v1/drivers/availability | Set a driver's online/offline status |

---

### 🛺 Ride Management

| Method | Endpoint                   | Description                         |
| ------ | -------------------------- | ----------------------------------- |
| POST   | /api/v1/rides/request      | Request a new ride (Rider only)     |
| GET    | /api/v1/rides/my           | Get all rides for current user      |
| GET    | /api/v1/rides              | Get all rides (Admin only)          |
| GET    | /api/v1/rides/:id          | Get ride details by ID (Admin only) |
| PATCH  | /api/v1/rides/:id/accept   | Driver accepts a ride request       |
| PATCH  | /api/v1/rides/:id/pickup   | Driver marks a ride as "picked up"  |
| PATCH  | /api/v1/rides/:id/start    | Driver marks a ride as "in transit" |
| PATCH  | /api/v1/rides/:id/complete | Driver completes a ride             |
| PATCH  | /api/v1/rides/:id/cancel   | Rider or Admin cancels a ride       |

---

### 🛠️ Admin

| Method | Endpoint                | Description                            |
| ------ | ----------------------- | -------------------------------------- |
| GET    | /api/v1/admin/dashboard | Get admin dashboard stats (Admin only) |

---

## ❗ Error Response Format

All error responses follow this format for consistency:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "name": "ZodError",
    "issues": [
      {
        "path": ["email"],
        "message": "Invalid email address"
      }
    ]
  }
}
```

---

## 📌 Project Structure

```
src/
├── app.ts
├── server.ts
├── modules/
│   ├── auth/
│   ├── user/
│   ├── driver/
│   ├── ride/
│   └── admin/
├── middleware/
├── config/
├── utils/
└── errorHelper/
```

## 👨‍💻 Author

**Simanta Barua**  
📧 simanta.barua@yahoo.com  
🌐 [Portfolio](https://simanta.web.app/)  
🔗 [LinkedIn](https://www.linkedin.com/in/simantabarua/)  
💻 [GitHub](https://github.com/simantabarua)

# 🚗 Ride Booking API

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
git clone https://github.com/simantabarua/ride-booking-api.git
cd ride-booking-api
npm install
```

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
DATABASE_URL=mongodb://localhost:27017/ride-booking
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Start the development server:

```bash
npm run dev
```

---

## 📘 API Endpoints

### Auth

| Method | Endpoint                     | Description                       |
| ------ | ---------------------------- | --------------------------------- |
| POST   | `/api/v1/auth/register`      | Register a new user               |
| POST   | `/api/v1/auth/login`         | Login with email and password     |
| POST   | `/api/v1/auth/google`        | Login/Register using Google OAuth |
| POST   | `/api/v1/auth/refresh-token` | Refresh JWT tokens                |
| POST   | `/api/v1/auth/logout`        | Clear cookies and logout          |

### Users

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | `/api/v1/users/me`     | Get current user profile |
| PATCH  | `/api/v1/users/update` | Update user profile      |

### Drivers

| Method | Endpoint                          | Description                     |
| ------ | --------------------------------- | ------------------------------- |
| PATCH  | `/api/v1/driver/info`             | Upsert driver details           |
| PATCH  | `/api/v1/driver/set-availability` | Set online/offline availability |
| GET    | `/api/v1/driver/profile`          | Get driver profile              |

### Rides

| Method | Endpoint                     | Description                        |
| ------ | ---------------------------- | ---------------------------------- |
| POST   | `/api/v1/rides/request`      | Request a new ride (rider)         |
| PATCH  | `/api/v1/rides/accept/:id`   | Accept a ride (driver)             |
| PATCH  | `/api/v1/rides/pickup/:id`   | Mark as picked up (driver)         |
| PATCH  | `/api/v1/rides/start/:id`    | Start the trip (driver)            |
| PATCH  | `/api/v1/rides/complete/:id` | Complete the ride (driver)         |
| PATCH  | `/api/v1/rides/cancel/:id`   | Cancel the ride (rider or admin)   |
| GET    | `/api/v1/rides/my`           | Get all rides for the current user |
| GET    | `/api/v1/rides/:id`          | Get ride details by ID             |

---

## 🛡️ Role-Based Access Control

| Role   | Permissions                            |
| ------ | -------------------------------------- |
| Rider  | Request rides, view own rides          |
| Driver | Accept and manage rides, update status |
| Admin  | View and manage all rides & users      |

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

---

## ✅ Status

- [x] Auth (Email/Google + JWT)
- [x] Rider/Driver info with validation
- [x] Role-based ride lifecycle
- [ ] Payment integration (WIP)
- [ ] Admin dashboard features

---

## 👨‍💻 Author

**Simanta Barua**  
🌐 [Portfolio](https://simanta.web.app/)  
📧 simanta.barua@yahoo.com  
🔗 [LinkedIn](https://linkedin.com/in/simantabarua)  
💻 [GitHub](https://github.com/simantabarua)

---

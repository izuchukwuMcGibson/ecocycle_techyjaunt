# ♻️ EcoCycle Backend

Backend service for EcoCycle – a waste management system with **Households**, **Drivers**, and **Admins**.  
Built with **Node.js, Express, and MongoDB**.

---

## ⚡ Features
- User Authentication (JWT)
- Household pickup requests
- Driver management & availability
- Pickup assignment & status updates
- Driver live location tracking
- Subscription plans (weekly / monthly)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 16)
- MongoDB running locally or a cloud URI

### Setup
```bash
# Clone the repo
git clone https://github.com/izuchukwuMcGibson/ecocycle_techyjaunt.git
cd ecocycle_techyjaunt

# Install dependencies
npm install

# Create .env file
PORT=5000
MONGO_URI=mongodb://localhost:27017/waste-x
JWT_SECRET=yourSecretKey

# Run in dev mode
npm run dev

🔑 Authentication Endpoints
Signup

POST /api/auth/signup

Request body:

{ "name": "Rayhan", "email": "rayhan@example.com", "password": "123456", "role": "household" }

Roles: household, driver, admin
Signin

POST /api/auth/signin

Request body:

{ "email": "rayhan@example.com", "password": "123456" }

Get Current User

GET /api/auth/me
Requires Authorization: Bearer <token>
🚛 Pickup Endpoints

    POST /api/pickups/ → Household requests pickup

    GET /api/pickups/ → Admin/Driver view pickups

    POST /api/pickups/assign → Admin assigns driver

    POST /api/pickups/update → Update status (requested, assigned, in_progress, completed, cancelled)

👷 Driver Endpoints

    GET /api/drivers/ → List drivers

    POST /api/drivers/update → Driver updates availability

📍 Tracking Endpoints

    POST /api/tracking/update → Driver updates location { lat, lng, pickupId }

    GET /api/tracking/:driverId → Get driver’s location

🗓️ Subscription Endpoints

    POST /api/subscriptions/ → Household subscribes (weekly or monthly)

    GET /api/subscriptions/ → Household views own / Admin views all

    POST /api/subscriptions/cancel → Admin cancels subscription


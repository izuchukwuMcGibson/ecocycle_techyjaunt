# Ecocycle Auth & Core API

This document lists the backend API endpoints available in the `ECOCYCLE-signin-auth` service, their expected request bodies, authentication requirements, and example responses.

Base URL: (e.g.) `http://localhost:4000/api`

## Authentication

### POST /api/auth/signup
Create a new account. The client must provide a `role` field to select account type.

- Auth: public
- Body (application/json):
  - name: string (required)
  - email: string (required)
  - password: string (required)
  - role: string (required) - one of `household`, `driver`, `admin`
  - phone: string (optional)
  - driver-only: licenseNumber (required if role=driver), vehicleId, assignedZone
  - admin-only: permissions (array), department

Example:

```json
{
  "name": "Bob Driver",
  "email": "bob@driver.com",
  "password": "Pass123!",
  "role": "driver",
  "licenseNumber": "DRV-123"
}
```

Response (201):
```json
{
  "message": "User created. Verification token sent to your email.",
  "user": { "id": "...", "name": "Bob Driver", "email": "bob@driver.com", "role": "driver" },
  "token": "<jwt>"
}
```

Errors: 400 Bad Request (missing fields), 409 Conflict (email exists)

---

### POST /api/auth/signin
Authenticate a user and receive a JWT.

- Auth: public
- Body:
  - email: string (required)
  - password: string (required)

Response (200):
```json
{
  "message": "Authenticated",
  "user": { "id": "...", "name": "...", "email": "...", "role": "household" },
  "token": "<jwt>"
}
```

Errors: 400/401/403 depending on validation, email verification, invalid credentials

---

### GET /api/auth/me
Get current user's profile

- Auth: Bearer token required (JWT)
- Response: { user: { ... } }

### POST /api/auth/verify-otp
- Body: { email, otp }

### POST /api/auth/forgot-password
- Body: { email }

### POST /api/auth/reset-password/:userId
- Body: { email, newPassword, confirmPassword }

### GET /api/auth/verify-email/:token
- Verifies email token sent at signup


## Pickups

### POST /api/pickups/
Create a pickup (household only)

- Auth: Bearer token
- Body: { address: string, scheduledAt: ISODatetime }
- Response: 201 created

### POST /api/pickups/assign
Admin route to assign a driver to a pickup.
- Body: { pickupId, driverId }

### POST /api/pickups/status
Driver updates a pickup's status.
- Body: { pickupId, status } where status in ["in-progress","completed","cancelled"]

### POST /api/pickups/decision
Driver accepts or rejects an assigned pickup.
- Body: { pickupId, decision } decision = "accept" | "reject"

### GET /api/pickups/
List pickups. Behavior depends on role:
- household: returns pickups for the household
- driver: returns pickups assigned to driver
- admin: returns all pickups


## Subscriptions

### POST /api/subscriptions/
Household subscribes to a plan.
- Body: { plan: 'one-off'|'weekly'|'bi-weekly'|'monthly', category?: 'family'|'business' }
- Response: 201 created

### GET /api/subscriptions/
Get subscriptions for current user (household) or all (admin)

### POST /api/subscriptions/cancel
Admin cancels a subscription.
- Body: { subscriptionId }


## Drivers

### POST /api/drivers/add
Add a driver (open endpoint by default in this codebase).
- Body: { name, email, password, phone, licenseNumber, vehicleId, assignedZone }
- Response: 201 created

### GET /api/drivers/all
Get all drivers (no auth in current code)


## Missed Pickups

### POST /api/missed-pickups/
Household reports a missed pickup.
- Body: { pickupDate, description }

### GET /api/missed-pickups/
Admin lists missed pickup reports.

### POST /api/missed-pickups/resolve
Admin resolves a report.
- Body: { reportId }


## Authentication & headers
- Include an Authorization header when required:
  Authorization: Bearer <token>

## Notes & next steps
- Role is required at signup and is validated server-side. The server creates the correct discriminator model (driver/admin/household) so the stored document includes role-specific fields.
- If you would like a Postman collection or OpenAPI (Swagger) YAML generated from this doc, I can produce it next.

---
Generated: Oct 5, 2025

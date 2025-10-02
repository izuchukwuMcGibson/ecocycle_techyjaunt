ECOCYLE-signin-auth
=======================

Environment Setup:
------------------
Create a .env file at the root with:
  PORT=4000
  MONGO_URI= mongodb://localhost:27017/ecocycle
  JWT_SECRET= MyS3cr3tK3y

Run dev server:
  npm run dev

Auth Endpoints:
---------------
POST   /api/auth/signup    { name, email, password, role }   -> roles: household, driver, admin
POST   /api/auth/signin    { email, password }
GET    /api/auth/me        (requires Bearer token)

Pickup Endpoints:
-----------------
POST   /api/pickups/       (household only) { address, scheduledTime }
GET    /api/pickups/       (admin/driver can view)
POST   /api/pickups/assign { pickupId, driverId } (admin only)
POST   /api/pickups/update { pickupId, status } -> status: requested, assigned, in_progress, completed, cancelled

Driver Endpoints:
-----------------
GET    /api/drivers/       (admin/household)
POST   /api/drivers/update { available } (driver only)

Subscription Endpoints:
-----------------------
POST   /api/subscriptions/       { plan } -> weekly or monthly (household only)
GET    /api/subscriptions/       (household sees own, admin sees all)
POST   /api/subscriptions/cancel { subscriptionId } (admin only)

NOTES
=====

- Please run the postman yourself, I was in a hurry so i couldn't
- I have used Copilot to add comments, so that it will be more undersatndable
- Any questions you have please ask me
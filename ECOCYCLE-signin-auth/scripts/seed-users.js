require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user-schema');
const Driver = require('../models/driver-schema');
const Admin = require('../models/admin-schema');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const users = [
      { model: User, role: 'household', data: { name: 'Alice Household', email: 'alice@house.com', password: 'Password123!' } },
      { model: Driver, role: 'driver', data: { name: 'Bob Driver', email: 'bob@driver.com', password: 'Driver123!', licenseNumber: 'DRV-12345', vehicleId: 'TRUCK-9A', assignedZone: 'Zone A' } },
      { model: Admin, role: 'admin', data: { name: 'Cecilia Admin', email: 'cecilia@admin.com', password: 'Admin123!', permissions: ['manageUsers','viewReports'], department: 'Operations' } }
    ];

    for (const u of users) {
      const exists = await User.findOne({ email: u.data.email });
      if (exists) {
        console.log('Skipping existing:', u.data.email);
        continue;
      }
      const hash = await bcrypt.hash(u.data.password, SALT_ROUNDS);
      const user = new u.model({ ...u.data, passwordHash: hash });
      await user.save();
      console.log('Created:', u.data.email);
    }

    console.log('Seed done ');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();

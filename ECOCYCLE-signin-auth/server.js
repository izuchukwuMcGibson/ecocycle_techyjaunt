require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const connectDB = require('./config/configDb');

const authRoutes = require('./routes/routeAuth.js');
const pickupRoutes = require('./routes/routePickup.js');
const driverRoutes = require('./routes/routeDriver.js');
const subscriptionRoutes = require('./routes/routeSubscription.js');
const missedPickupRoutes = require('./routes/routeMissedPickup.js');


const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
// Allow cross-origin requests during development. In production restrict origin as needed.
app.use(cors());

// Rate limiter
const limiter = rateLimit({ windowMs: 60 * 1000, max: 30 });
app.use('/api/auth', limiter);

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/missed-pickups', missedPickupRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





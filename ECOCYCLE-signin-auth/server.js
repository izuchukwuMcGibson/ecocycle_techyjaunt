require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const connectDB = require('./config/configDb');

const authRoutes = require('./routes/routeAuth');
const pickupRoutes = require('./routes/routePickup');
const driverRoutes = require('./routes/routeDriver');
const subscriptionRoutes = require('./routes/routeSubscription');


const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Rate limiter
const limiter = rateLimit({ windowMs: 60 * 1000, max: 30 });
app.use('/api/auth', limiter);

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



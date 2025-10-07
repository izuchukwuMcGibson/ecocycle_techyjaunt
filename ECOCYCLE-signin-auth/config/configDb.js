
const mongoose = require('mongoose');

// Use an environment variable when available; fall back to the hard-coded URI
// (the project previously included this URI in the file). It's recommended to
// set MONGO_URI in your environment for security.
const uri = process.env.MONGO_URI || 'mongodb+srv://rayhansanni:bl%40de123@ecocycle.hsife2a.mongodb.net/?retryWrites=true&w=majority&appName=ecocycle';

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    // Exit the process - the server shouldn't run without a DB connection
    process.exit(1);
  }
}

module.exports = connectDB;

const mongoose = require('mongoose');

/**
 * connectDB
 * ---------
 * Establishes a connection to MongoDB Atlas (or any MongoDB instance)
 * using the URI provided in the MONGO_URI environment variable.
 *
 * This is the "Database" piece of the MVC architecture - it lives
 * completely outside the routes/controllers and is imported once
 * when the server boots up.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('\n[DB] ERROR: MONGO_URI is not defined in your .env file.');
    console.error('[DB] Create a .env file (see .env.example) and add your MongoDB Atlas connection string.\n');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(uri, {
      // Modern mongoose (8.x) no longer needs useNewUrlParser/useUnifiedTopology,
      // but we keep the options object here in case you add more settings later.
    });

    console.log(`[DB] MongoDB connected -> ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('[DB] MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] MongoDB disconnected.');
    });
  } catch (err) {
    console.error('[DB] Failed to connect to MongoDB:', err.message);
    console.error('[DB] Double check your MONGO_URI, IP Allowlist, and DB user credentials in MongoDB Atlas.');
    process.exit(1);
  }
}

module.exports = connectDB;

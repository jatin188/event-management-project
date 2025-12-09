// server/src/config/db.js
// Connects to MongoDB URI if provided, otherwise falls back to an in-memory MongoDB for local dev.
// Uses mongodb-memory-server to avoid requiring a local Mongo installation.

const mongoose = require('mongoose');

async function connectWithUri(uri) {
  await mongoose.connect(uri, {
    // useNewUrlParser/useUnifiedTopology not required in mongoose v6+
  });
  console.log('MongoDB connected to', uri);
}

async function startInMemoryMongo() {
  const { MongoMemoryServer } = require('mongodb-memory-server');

  console.log('No MONGO_URI found — starting in-memory MongoDB (dev mode)');
  const mongoServer = await MongoMemoryServer.create({
    instance: {
      // optionally set dbName
      dbName: process.env.INMEM_DB_NAME || 'eventhorizon_inmem'
    }
  });
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  console.log('Connected to in-memory MongoDB:', uri);

  // Optional: expose stop function so tests or shutdowns can stop the in-memory server
  return mongoServer;
}

module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (uri && uri.trim().length > 0) {
    try {
      await connectWithUri(uri);
      return null;
    } catch (err) {
      console.error('Failed to connect to MONGO_URI:', err.message);
      // fallback to in-memory
    }
  }

  // If env explicitly disables in-memory, throw error
  if (process.env.USE_INMEM === 'false') {
    throw new Error('MONGO_URI not provided and USE_INMEM set to false — cannot start DB.');
  }

  const inmem = await startInMemoryMongo();
  // return the mongodb-memory-server instance in case caller wants to stop it
  return inmem;
};

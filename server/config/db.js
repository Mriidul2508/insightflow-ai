const dns = require('dns');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Node.js on Windows sometimes can't resolve MongoDB Atlas SRV records
// via the default DNS resolver — force Google DNS as fallback.
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  logger.info('MongoDB connected successfully');
};

mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
mongoose.connection.on('error', (err) => logger.error('MongoDB error', { error: err.message }));

module.exports = connectDB;

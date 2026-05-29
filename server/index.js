const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const logger = require('./utils/logger');
const aiRoutes = require('./routes/ai.routes');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => res.json({ status: 'InsightFlow API is live' }));
app.use('/api', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

connectDB()
  .then(() => app.listen(PORT, () => logger.info(`Server running on port ${PORT}`)))
  .catch((err) => {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  });

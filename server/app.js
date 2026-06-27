require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const todoRoutes = require('./routes/todoRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Routes
app.use('/api/todos', todoRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'ReshmaTodo Backend is healthy',
    timestamp: new Date().toISOString()
  });
});

// Fallback 404 for api routes
app.use('/api/*', (req, res, next) => {
  res.status(404);
  const error = new Error(`API Endpoint Not Found - ${req.originalUrl}`);
  next(error);
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`ReshmaTodo Backend Server is running!`);
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Data Source: ${process.env.DATA_FILE_PATH || './data/todos.json'}`);
  console.log(`Developer: Reshma (Reg No: 22MID0251)`);
  console.log(`==================================================`);
});

module.exports = app;

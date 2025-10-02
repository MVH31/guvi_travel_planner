const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Import models and clients
const Itinerary = require('./models/Itinerary');
const { PrismaClient } = require('./generated/prisma');

// Import routes
const authRoutes = require('./routes/auth');
const itineraryRoutes = require('./routes/itinerary');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Create Prisma Client instance
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// PostgreSQL connection test
const connectPostgreSQL = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL via Prisma');
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/itinerary', itineraryRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test MongoDB connection
    const mongoState = mongoose.connection.readyState;
    
    // Test PostgreSQL connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'healthy',
      mongodb: mongoState === 1 ? 'connected' : 'disconnected',
      postgresql: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('🔄 Shutting down gracefully...');
  
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
  }
  
  try {
    await prisma.$disconnect();
    console.log('✅ Prisma connection closed');
  } catch (error) {
    console.error('❌ Error closing Prisma connection:', error);
  }
  
  process.exit(0);
};

// Handle shutdown signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Start server
const startServer = async () => {
  try {
    // Connect to databases
    await connectMongoDB();
    await connectPostgreSQL();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth`);
      console.log(`📝 Itinerary routes: http://localhost:${PORT}/api/itinerary`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Initialize server
startServer();
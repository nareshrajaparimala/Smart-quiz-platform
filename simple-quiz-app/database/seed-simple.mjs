const mongoose = require('mongoose');
require('dotenv').config({ path: '../backend/.env' });

// Simple connection test
async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizapp', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('✅ MongoDB connected successfully');
    
    // Test basic operation
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections`);
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
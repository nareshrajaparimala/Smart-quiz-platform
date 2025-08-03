#!/bin/bash

echo "🗄️ Starting MongoDB for Quiz Application..."

# Check if MongoDB container already exists
if docker ps -a --format 'table {{.Names}}' | grep -q "quiz-mongodb"; then
    echo "📦 MongoDB container exists, starting it..."
    docker start quiz-mongodb
else
    echo "📦 Creating new MongoDB container..."
    docker run -d -p 27017:27017 --name quiz-mongodb mongo:7.0
fi

echo "⏳ Waiting for MongoDB to be ready..."
sleep 5

# Test connection
if docker exec quiz-mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB is running and ready!"
    echo "🌱 Seeding database..."
    cd database && node seed.js
    echo "🎉 Setup complete! MongoDB is ready at localhost:27017"
else
    echo "❌ MongoDB failed to start properly"
    exit 1
fi
#!/bin/bash

echo "🚀 Quiz App Deployment Script"

# Check deployment type
read -p "Choose deployment: (1) Local Docker (2) Build for hosting (3) Development: " choice

case $choice in
  1)
    echo "🐳 Starting Docker deployment..."
    cd docker
    docker-compose up -d
    echo "✅ App running at http://localhost"
    ;;
  2)
    echo "📦 Building for production..."
    
    # Build frontend
    cd frontend
    npm install
    npm run build
    echo "✅ Frontend built in frontend/dist/"
    
    # Prepare backend
    cd ../backend
    npm install --production
    echo "✅ Backend ready for deployment"
    
    echo "📋 Deployment files ready:"
    echo "   - Frontend: frontend/dist/ (upload to static hosting)"
    echo "   - Backend: backend/ (deploy to Node.js hosting)"
    echo "   - Database: MongoDB required"
    ;;
  3)
    echo "🔧 Starting development servers..."
    
    # Start MongoDB
    docker run -d -p 27017:27017 --name quiz-mongodb mongo:7.0 2>/dev/null || docker start quiz-mongodb
    
    # Seed database
    cd database && node seed.js
    
    # Start backend
    cd ../backend
    npm run dev &
    
    # Start frontend
    cd ../frontend
    npm run dev &
    
    echo "✅ Development servers starting..."
    echo "   - Frontend: http://localhost:3001"
    echo "   - Backend: http://localhost:3000"
    ;;
  *)
    echo "❌ Invalid choice"
    ;;
esac
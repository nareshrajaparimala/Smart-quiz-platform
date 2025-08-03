#!/bin/bash

echo "🐳 Starting Quiz Application with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f docker/.env ]; then
    echo "📝 Creating environment file..."
    cp docker/.env.example docker/.env
    echo "⚠️  Please edit docker/.env with your configuration before proceeding."
    echo "   Especially set JWT_SECRET and email settings."
    read -p "Press Enter to continue after editing .env file..."
fi

echo "🏗️  Building and starting containers..."
cd docker
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

echo "🌱 Seeding database..."
docker-compose exec backend node ../database/seed.js

echo "✅ Application started successfully!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost"
echo "   Backend:  http://localhost:3000"
echo "   Health:   http://localhost:3000/health"
echo ""
echo "📊 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop the application:"
echo "   docker-compose down"
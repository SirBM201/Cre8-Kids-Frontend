#!/bin/bash

# Cre8 Kids Deployment Script
# This script automates the deployment process

set -e

echo "🚀 Starting Cre8 Kids deployment..."

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

# Build the application
echo "🔨 Building the application..."
docker-compose build

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start the application
echo "🚀 Starting the application..."
docker-compose up -d

# Wait for the application to be ready
echo "⏳ Waiting for the application to be ready..."
sleep 10

# Check if the application is running
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo "🌐 Backend API: http://localhost:5000"
    echo "📊 Health Check: http://localhost:5000/api/health"
    echo ""
    echo "🎉 Deployment completed successfully!"
else
    echo "❌ Application failed to start. Check the logs with: docker-compose logs"
    exit 1
fi

echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop app: docker-compose down"
echo "  Restart: docker-compose restart"
echo "  Update: git pull && ./deploy.sh"

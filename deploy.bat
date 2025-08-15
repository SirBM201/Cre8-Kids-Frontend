@echo off
echo 🚀 Starting Cre8 Kids deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo 🔨 Building the application...
docker-compose build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Check the error messages above.
    pause
    exit /b 1
)

echo 🛑 Stopping existing containers...
docker-compose down

echo 🚀 Starting the application...
docker-compose up -d

if %errorlevel% neq 0 (
    echo ❌ Failed to start containers. Check the error messages above.
    pause
    exit /b 1
)

echo ⏳ Waiting for the application to be ready...
timeout /t 10 /nobreak >nul

echo 📊 Checking application health...
curl -f http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Application is running successfully!
    echo 🌐 Backend API: http://localhost:5000
    echo 📊 Health Check: http://localhost:5000/api/health
    echo.
    echo 🎉 Deployment completed successfully!
) else (
    echo ❌ Application failed to start. Check the logs with: docker-compose logs
)

echo.
echo 📋 Useful commands:
echo   View logs: docker-compose logs -f
echo   Stop app: docker-compose down
echo   Restart: docker-compose restart
echo   Update: git pull ^&^& deploy.bat
echo.
pause

# 🚀 Cre8 Kids Deployment Guide

This guide will help you deploy your Cre8 Kids application to production.

## 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- A domain name (optional but recommended)
- SSL certificate (for HTTPS)

## 🎯 Quick Deployment (Local/Testing)

### 1. Build and Run with Docker

```bash
# Clone the repository
git clone <your-repo-url>
cd cre8-kids

# Make the deployment script executable
chmod +x deploy.sh

# Deploy the application
./deploy.sh
```

### 2. Manual Docker Commands

```bash
# Build the application
docker-compose build

# Start the application
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop the application
docker-compose down
```

## 🌐 Production Deployment

### 1. Environment Configuration

1. **Copy the production environment file:**
   ```bash
   cp production.env .env
   ```

2. **Edit `.env` with your production values:**
   ```bash
   # Update these values for your domain
   CORS_ORIGIN=https://yourdomain.com
   JWT_SECRET=your-super-secure-jwt-secret-key
   API_BASE_URL=https://yourdomain.com/api
   FRONTEND_URL=https://yourdomain.com
   ```

### 2. Cloud Deployment Options

#### Option A: Railway (Recommended for beginners)
1. Go to [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Set environment variables
4. Deploy automatically

#### Option B: Render
1. Go to [Render](https://render.com/)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set environment variables
5. Deploy

#### Option C: DigitalOcean App Platform
1. Go to [DigitalOcean](https://www.digitalocean.com/)
2. Create a new App
3. Connect your GitHub repository
4. Configure environment variables
5. Deploy

#### Option D: AWS/GCP (Advanced)
1. Set up EC2 instance or GCP Compute Engine
2. Install Docker and Docker Compose
3. Clone your repository
4. Run the deployment script

### 3. Frontend Deployment

#### Deploy to Vercel (Recommended)
1. Go to [Vercel](https://vercel.com/)
2. Import your GitHub repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables:
   ```
   VITE_API_BASE_URL=https://your-backend-domain.com/api
   ```

#### Deploy to Netlify
1. Go to [Netlify](https://netlify.com/)
2. Import your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables

### 4. Database Migration (Optional)

For production, consider migrating from SQLite to PostgreSQL:

```bash
# Install PostgreSQL dependencies
npm install pg

# Update database configuration
# Create migration scripts
# Update environment variables
```

## 🔒 Security Checklist

- [ ] Change default JWT secret
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure CORS origins properly
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Set up proper logging
- [ ] Configure file upload limits
- [ ] Set up monitoring and alerts

## 📊 Monitoring & Maintenance

### Health Checks
- Backend: `https://yourdomain.com/api/health`
- Frontend: Check if the app loads properly

### Logs
```bash
# View application logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f cre8kids-app
```

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and redeploy
./deploy.sh
```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   lsof -i :5000
   
   # Kill the process
   kill -9 <PID>
   ```

2. **Database connection issues:**
   ```bash
   # Check database file permissions
   ls -la data/
   
   # Reinitialize database
   npm run db:init
   ```

3. **Build failures:**
   ```bash
   # Clear Docker cache
   docker system prune -a
   
   # Rebuild from scratch
   docker-compose build --no-cache
   ```

### Performance Issues

1. **Enable compression:**
   ```javascript
   import compression from 'compression';
   app.use(compression());
   ```

2. **Add caching:**
   ```javascript
   app.use('/api/content', cache('5 minutes'), contentRoutes);
   ```

3. **Database optimization:**
   - Add indexes to frequently queried fields
   - Implement connection pooling
   - Add query caching

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer (nginx, HAProxy)
- Deploy multiple backend instances
- Use Redis for session storage

### Database Scaling
- Implement read replicas
- Use connection pooling
- Consider database sharding for large datasets

### File Storage
- Migrate to cloud storage (AWS S3, Google Cloud Storage)
- Implement CDN for static assets
- Add image optimization

## 🎉 Success Metrics

After deployment, verify:
- [ ] Application loads without errors
- [ ] All API endpoints respond correctly
- [ ] Database operations work properly
- [ ] File uploads function correctly
- [ ] Authentication flows work
- [ ] Performance meets expectations
- [ ] Error monitoring is active
- [ ] Logs are being generated

## 📞 Support

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Verify environment variables
3. Check network connectivity
4. Review security group/firewall settings
5. Test locally first

---

**Happy Deploying! 🚀**

Your Cre8 Kids app is now ready for the world!

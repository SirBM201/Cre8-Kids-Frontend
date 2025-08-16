# Cre8 Kids - Educational Learning Platform

A comprehensive educational platform designed for children, featuring interactive learning experiences, parental controls, and educator tools.

## 🚀 **Deployment Notes**

### **Backend (Koyeb)**
- **Work Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Path**: `/health`
- **Required Environment Variables**:
  - `NODE_ENV`
  - `PORT`
  - `MONGODB_URI`
  - `CORS_ORIGIN`
  - `JWT_SECRET`

### **Frontend (Vercel)**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Required Environment Variables**:
  - `VITE_API_URL` (set to https://difficult-sindee-bmsconcept-eaac9d0f.koyeb.app)

## 🏗️ **Architecture**

This is a monorepo containing:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + SQLite
- **Database**: SQLite (can be upgraded to MongoDB/PostgreSQL)

## 🚀 **Quick Start**

### **Frontend Development**
```bash
npm install
npm run dev
```

### **Backend Development**
```bash
cd server
npm install
npm run dev
```

### **Full Stack Development**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server
npm run dev
```

## 📚 **Features**

### **Kid Mode**
- Interactive stories and quizzes
- Educational games and activities
- Progress tracking and achievements
- Accessibility features

### **Parent Portal**
- Child profile management
- Learning progress monitoring
- Content filtering and restrictions
- Educational insights and reports

### **Educator Tools**
- Content creation and management
- Student progress tracking
- Assignment creation and grading
- Learning analytics

## 🔧 **Technology Stack**

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, SQLite
- **Authentication**: JWT, bcrypt
- **Email**: Nodemailer
- **Deployment**: Vercel (Frontend), Koyeb (Backend)

## 📖 **Documentation**

- [Integration Guide](INTEGRATION_README.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Production Readiness](PRODUCTION_READY.md)
- [Email Security Features](EMAIL_SECURITY_FEATURES.md)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the ISC License.

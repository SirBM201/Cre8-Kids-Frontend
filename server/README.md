# Cre8 Kids Backend Server

A comprehensive backend API for the Cre8 Kids learning platform, built with Express.js, SQLite, and JWT authentication.

## 🚀 Features

- **User Authentication**: JWT-based auth for parents, educators, and admins
- **Content Management**: Stories, quizzes, songs with approval workflow
- **Progress Tracking**: Learning progress, streaks, and badges
- **File Uploads**: Secure file handling for images and audio
- **Role-based Access Control**: Different permissions for different user types
- **Database**: SQLite with automatic initialization and seeding

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Configure your environment variables in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key
   ```

3. **Initialize database:**
   ```bash
   npm run db:init
   ```

4. **Start the server:**
   ```bash
   # Development mode
   npm run server:dev
   
   # Production mode
   npm run server
   ```

## 🗄️ Database Schema

### Users Table
- `id`: Unique identifier
- `email`: User email (unique)
- `password_hash`: Bcrypt hashed password
- `role`: User role (parent, educator, admin)
- `display_name`: User's display name
- `created_at`, `updated_at`: Timestamps

### Kid Profiles Table
- `id`: Unique identifier
- `parent_id`: Reference to parent user
- `display_name`: Child's display name
- `age`: Child's age
- `avatar_color`: Avatar color hex code
- `learning_level`: Learning level (beginner, intermediate, advanced)

### Content Tables
- **Stories**: Title, description, age band, tags, pages
- **Quizzes**: Title, description, questions, difficulty, time limit
- **Songs**: Title, description, audio URL, duration, lyrics

### Progress Tracking
- **Learning Progress**: Daily learning minutes, completed items, quiz scores
- **Badges**: Achievement system with criteria-based unlocking

## 🔐 Authentication

### JWT Token Structure
```json
{
  "userId": "user-uuid",
  "email": "user@example.com",
  "role": "parent",
  "displayName": "User Name",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Protected Routes
Most routes require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/refresh` - Refresh JWT token

### User Management
- `GET /api/users/kids` - Get kid profiles
- `POST /api/users/kids` - Create kid profile
- `PUT /api/users/kids/:id` - Update kid profile
- `DELETE /api/users/kids/:id` - Delete kid profile
- `GET /api/users/settings` - Get parent settings
- `PUT /api/users/settings` - Update parent settings

### Content Management
- `GET /api/content/stories` - Get stories (with filtering)
- `GET /api/content/stories/:id` - Get story by ID
- `POST /api/content/stories` - Create new story (educators only)
- `GET /api/content/quizzes` - Get quizzes (with filtering)
- `GET /api/content/quizzes/:id` - Get quiz by ID
- `POST /api/content/quizzes` - Create new quiz (educators only)
- `GET /api/content/songs` - Get songs (with filtering)
- `POST /api/content/songs` - Create new song (educators only)
- `GET /api/content/search` - Search content

### Progress Tracking
- `GET /api/progress/:childId` - Get learning progress
- `POST /api/progress/:childId/update` - Update learning progress
- `POST /api/progress/:childId/quiz-results` - Submit quiz results
- `GET /api/progress/:childId/streak` - Get learning streak
- `GET /api/progress/:childId/badges` - Get earned badges

### File Uploads
- `POST /api/upload/story-images` - Upload story images
- `POST /api/upload/song-audio` - Upload song audio
- `POST /api/upload/quiz-images` - Upload quiz images
- `POST /api/upload/avatar` - Upload profile avatar
- `POST /api/upload/bulk` - Bulk file upload
- `DELETE /api/upload/:filename` - Delete uploaded file

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure, time-limited authentication
- **Rate Limiting**: API request throttling
- **Input Validation**: Express-validator for all inputs
- **File Type Validation**: Whitelist of allowed file types
- **File Size Limits**: Configurable upload size restrictions
- **CORS Protection**: Configurable cross-origin policies
- **Helmet Security**: Security headers middleware

## 📁 File Structure

```
server/
├── index.js              # Main server file
├── database/
│   └── init.js          # Database initialization
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── users.js         # User management routes
│   ├── content.js       # Content management routes
│   ├── progress.js      # Progress tracking routes
│   └── upload.js        # File upload routes
├── uploads/              # File upload directory
│   ├── stories/         # Story images
│   ├── songs/           # Song audio files
│   ├── quizzes/         # Quiz images
│   └── avatars/         # Profile avatars
└── README.md            # This file
```

## 🧪 Testing

### Sample API Calls

**Register a new parent:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@example.com",
    "password": "password123",
    "displayName": "Sample Parent",
    "role": "parent"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@example.com",
    "password": "password123"
  }'
```

**Create kid profile (with auth token):**
```bash
curl -X POST http://localhost:5000/api/users/kids \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Alex",
    "age": 7,
    "avatarColor": "#3b82f6",
    "learningLevel": "intermediate"
  }'
```

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Set proper production values
2. **Database**: Consider PostgreSQL/MySQL for production
3. **File Storage**: Use cloud storage (AWS S3, Google Cloud Storage)
4. **HTTPS**: Enable SSL/TLS
5. **Monitoring**: Add logging and monitoring
6. **Backup**: Regular database backups

### Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs

---

**Built with ❤️ for kids' learning and development**

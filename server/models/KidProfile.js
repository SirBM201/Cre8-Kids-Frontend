import mongoose from 'mongoose';

const kidProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 3,
    max: 12
  },
  avatar: {
    type: String,
    default: '👦'
  },
  accessibility: {
    highContrast: {
      type: Boolean,
      default: false
    },
    largeText: {
      type: Boolean,
      default: false
    },
    dyslexiaFriendly: {
      type: Boolean,
      default: false
    }
  },
  settings: {
    learningGoals: {
      dailyMinutes: {
        type: Number,
        default: 15,
        min: 5,
        max: 120
      },
      weeklyTarget: {
        type: Number,
        default: 5,
        min: 1,
        max: 7
      },
      focusAreas: [{
        type: String,
        enum: ['reading', 'math', 'creativity', 'science', 'social']
      }]
    },
    restrictions: {
      maxScreenTime: {
        type: Number,
        default: 60,
        min: 15,
        max: 180
      },
      bedtime: {
        type: String,
        default: '20:00'
      },
      contentFilter: {
        type: String,
        enum: ['age-appropriate', 'strict', 'moderate', 'relaxed'],
        default: 'age-appropriate'
      }
    },
    notifications: {
      progressUpdates: {
        type: Boolean,
        default: true
      },
      achievementAlerts: {
        type: Boolean,
        default: true
      },
      weeklyReports: {
        type: Boolean,
        default: true
      }
    }
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
kidProfileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('KidProfile', kidProfileSchema);

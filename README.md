# Cre8 Kids - Learn & Create Safely

A kid-safe learning platform designed for children ages 3-12, featuring stories, songs, quizzes, and parent controls. Built with modern web technologies and a focus on safety, accessibility, and global standards.

## 🌟 Features

### Kid Mode (Center-Heavy, Large Tiles)
- **Home**: Age-appropriate grid with progress tracking and daily challenges
- **Stories**: Curated stories with read-aloud functionality and word highlighting
- **Songs**: Audio playback (unlocked after learning goals are met)
- **Quizzes**: Interactive multiple-choice questions with immediate feedback
- **Calm Corner**: Mindfulness activities and emotional learning
- **Co-Play**: Guided parent-child session cards
- **Offline Packs**: Downloadable content for offline use
- **Class Code**: Enter teacher assignments

### Parent Dashboard (PIN-Gated)
- **Dashboard**: Daily learning summary, progress charts, and conversation prompts
- **Profiles**: Manage child profiles with age bands and accessibility settings
- **Controls**: PIN management, Focus-Before-Fun settings, bedtime locks
- **Reports**: Progress tracking, badges, and printable reports
- **Downloads**: Offline pack management and seasonal resources

### Educator Mode (Demo)
- **Assignments**: Create and track class assignments
- **Lesson Builder**: Simple content creation tools

## 🔐 Safety & Privacy Features

- **No public chats, comments, or DMs**
- **No personal identifiers for children**
- **No targeted ads in kid mode**
- **All data stays on device (local storage)**
- **Clear separation between Kid and Parent modes**
- **PIN-gated parent access**

## 🎯 Focus-Before-Fun System

- Parents set daily learning minute requirements
- Fun activities (songs, games) unlock after learning goals are met
- Configurable unlock duration
- Visual feedback on locked/unlocked status

## 🌍 Global & Accessibility Features

- **Languages**: English primary with support for Yoruba, Hausa, Igbo
- **Accessibility**: Dyslexia-friendly fonts, high-contrast themes, larger text
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Offline Support**: Downloadable content packs

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cre8-kids
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production
```bash
npm run build
npm run preview
```

## 🎮 How to Use

### For Kids
1. Select **Kid Mode** from the main screen
2. Choose your favorite activity from the home grid
3. Read stories with read-aloud, take quizzes, or listen to songs
4. Earn badges and track your progress

### For Parents
1. Select **Parent Mode** from the main screen
2. Enter your 4-digit PIN (default: 1234)
3. Access dashboard, reports, and settings
4. Manage child profiles and learning goals

### For Educators
1. Access **Educator Mode** through Parent Mode
2. Create assignments and generate class codes
3. Track student completion rates

## 🏗️ Technical Architecture

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context + useReducer
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📱 Platform Support

- **Web App**: Responsive design for all devices
- **PWA Ready**: Service worker and offline capabilities planned
- **Mobile Optimized**: Touch-friendly interface with large tap targets
- **Desktop Friendly**: Full-featured experience on larger screens

## 🔧 Configuration

### Parent Settings
- **PIN**: 4-digit access code (changeable)
- **Focus-Before-Fun**: Daily learning minutes and fun unlock duration
- **Bedtime Lock**: Configurable time restrictions
- **Language**: English, Yoruba, Hausa, Igbo
- **Accessibility**: Font options, contrast, text size

### Kid Profiles
- **Display Name**: Nickname only (no photos required)
- **Age Band**: 3-5, 6-8, or 9-12 years
- **Avatar Color**: Personal color selection
- **Accessibility Preferences**: Individual settings per child

## 📊 Data & Privacy

- **Local Storage**: All data remains on the device
- **No External APIs**: Self-contained application
- **No Tracking**: No third-party analytics or cookies
- **Export Options**: Printable reports for parents
- **Data Portability**: Easy to backup and restore

## 🎨 Design System

### Colors
- **Primary**: Sky blue (#3b82f6)
- **Secondary**: Sunny yellow (#eab308)
- **Accent**: Coral (#ec4899)
- **Success**: Green (#22c55e)
- **Warning**: Orange (#f59e0b)

### Typography
- **Kid Mode**: Comic Sans MS, Chalkboard SE (friendly, readable)
- **Parent Mode**: Inter (clean, professional)
- **Accessibility**: OpenDyslexic support

### Components
- **Cards**: Rounded corners, soft shadows, hover effects
- **Buttons**: Large touch targets (44px minimum)
- **Navigation**: Clear visual cues and consistent patterns

## 🧪 Testing & Quality Assurance

### Acceptance Criteria
- ✅ Kid can open story, use read-aloud, navigate pages
- ✅ Quiz runs end-to-end with badge unlocking
- ✅ Focus-Before-Fun system works correctly
- ✅ Parent PIN gate functions properly
- ✅ Daily brief displays learning progress
- ✅ Offline packs can be saved/removed
- ✅ Class code assignments work
- ✅ Language settings persist
- ✅ Accessibility toggles function

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚧 Future Roadmap

### Phase 2 (Planned)
- **AI Personal Story Maker**: Generate custom stories
- **Speech Recognition**: Reading assessment and coaching
- **Mission Trails**: Gamified learning paths
- **PWA Caching**: Full offline support

### Phase 3 (Future)
- **Educator Marketplace**: Content sharing platform
- **School Analytics**: Advanced reporting and exports
- **Sponsor-a-Classroom**: Funding for schools
- **Multi-language Content**: Localized stories and activities

## 🤝 Contributing

This is a production-quality application built to global standards. When contributing:

1. Follow the existing code style and patterns
2. Ensure all acceptance criteria pass
3. Test on multiple devices and browsers
4. Maintain accessibility standards
5. Keep safety and privacy as top priorities

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support or feature requests:
- Check the documentation above
- Review the acceptance criteria
- Test the core functionality
- Ensure all requirements are met

---

**Cre8 Kids** - Empowering children to learn and create safely in a digital world. 🌟

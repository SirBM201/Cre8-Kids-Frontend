import { 
  Story, 
  Quiz, 
  Song, 
  CalmCornerItem, 
  CoPlayCard, 
  OfflinePack,
  Badge 
} from '../types';

export const seedStories: Story[] = [
  {
    id: 'story-1',
    type: 'story',
    title: 'Zee and the Moon Kite',
    ageBand: '6-8',
    tags: ['adventure', 'imagination', 'friendship'],
    safetyRating: 'G',
    estimatedMinutes: 5,
    pages: [
      {
        id: 'page-1',
        text: 'Zee tied a ribbon to her kite and wished to touch the moon.',
        imageUrl: '/images/kite-moon.jpg'
      },
      {
        id: 'page-2',
        text: 'The wind whooshed. The kite tugged. The moon smiled back.',
        imageUrl: '/images/kite-flying.jpg'
      }
    ]
  },
  {
    id: 'story-2',
    type: 'story',
    title: 'Colors in the Market',
    ageBand: '3-5',
    tags: ['colors', 'market', 'learning'],
    safetyRating: 'G',
    estimatedMinutes: 3,
    pages: [
      {
        id: 'page-1',
        text: 'Red tomatoes, green leaves, yellow mangoes — what colors do you see?',
        imageUrl: '/images/market-colors.jpg'
      },
      {
        id: 'page-2',
        text: 'Blue buckets splash! Clap for the colors with me!',
        imageUrl: '/images/market-buckets.jpg'
      }
    ]
  }
];

export const seedQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    type: 'quiz',
    title: 'Market Colors Quiz',
    ageBand: '3-5',
    tags: ['colors', 'market', 'learning'],
    safetyRating: 'G',
    estimatedMinutes: 2,
    questions: [
      {
        id: 'q1',
        prompt: 'What color are the tomatoes?',
        choices: ['Blue', 'Red', 'Purple'],
        correctIndex: 1
      },
      {
        id: 'q2',
        prompt: 'Which thing splashes?',
        choices: ['Bucket', 'Leaf', 'Cloud'],
        correctIndex: 0
      }
    ]
  }
];

export const seedSongs: Song[] = [
  {
    id: 'song-1',
    type: 'song',
    title: 'Sunny Steps',
    ageBand: '3-5',
    tags: ['movement', 'happy', 'energy'],
    safetyRating: 'G',
    audioUrl: '/audio/sunny-steps.mp3',
    duration: 45,
    lyrics: 'Step, step, step in the sun!'
  },
  {
    id: 'song-2',
    type: 'song',
    title: 'Starry Hums',
    ageBand: '6-8',
    tags: ['calm', 'bedtime', 'relaxing'],
    safetyRating: 'G',
    audioUrl: '/audio/starry-hums.mp3',
    duration: 60,
    lyrics: 'Hum, hum, hum with the stars...'
  }
];

export const seedCalmCorner: CalmCornerItem[] = [
  {
    id: 'calm-1',
    title: 'Belly Breaths',
    type: 'audio',
    content: 'Take deep breaths and feel your belly rise and fall',
    duration: 60,
    ageBand: '3-5'
  },
  {
    id: 'calm-2',
    title: 'Count 1-5 with Me',
    type: 'audio',
    content: 'Let\'s count together and take our time',
    duration: 30,
    ageBand: '3-5'
  },
  {
    id: 'calm-3',
    title: 'When I Feel Big Feelings',
    type: 'story',
    content: 'Sometimes our feelings are like big waves in the ocean. They come and go, and that\'s okay. We can take deep breaths and wait for the calm to return.',
    duration: 120,
    ageBand: '6-8'
  }
];

export const seedCoPlay: CoPlayCard[] = [
  {
    id: 'coplay-1',
    title: 'Market Color Hunt (Together)',
    description: 'Let\'s explore colors together!',
    steps: [
      'Read one story page aloud',
      'Ask child to find colors at home',
      'Answer 2 color questions',
      'High-five!'
    ],
    estimatedMinutes: 15,
    ageBand: '3-5'
  }
];

export const seedOfflinePacks: OfflinePack[] = [
  {
    id: 'pack-1',
    name: 'Starter Learning Pack',
    includedItems: ['story-2', 'quiz-1', 'song-1'],
    status: 'available',
    size: '15 MB'
  }
];

export const seedBadges: Badge[] = [
  {
    id: 'badge-1',
    name: 'First Story!',
    description: 'You completed your first story!',
    icon: '📚',
    unlockedAt: ''
  },
  {
    id: 'badge-2',
    name: 'Quiz Champ 5',
    description: 'You answered 5 questions correctly!',
    icon: '🏆',
    unlockedAt: ''
  },
  {
    id: 'badge-3',
    name: 'Learning Streak 3',
    description: 'You learned for 3 days in a row!',
    icon: '🔥',
    unlockedAt: ''
  }
];

export const defaultParentSettings = {
  pin: '1234',
  language: 'en' as const,
  focusBeforeFun: {
    dailyLearningMinutes: 15,
    funUnlockMinutes: 30
  },
  bedtimeLock: {
    startHour: 20,
    endHour: 7
  },
  whitelistCategories: ['stories', 'quizzes', 'songs', 'calm', 'coplay']
};

export const defaultKidProfile: Omit<import('../types').KidProfile, 'id'> = {
  name: 'Little Learner',
  age: 6,
  avatar: '👦',
  accessibility: {
    highContrast: false,
    largeText: false,
    dyslexiaFriendly: false
  }
};

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60000,
  max: 100,
  message: { success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' } }
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mock data for testing without MongoDB
const mockUsers = new Map();
const mockTopics = [
  { _id: '1', name: 'General Knowledge', description: 'Test your general knowledge', questionCount: 125, isActive: true },
  { _id: '2', name: 'Science', description: 'Questions about physics, chemistry, biology', questionCount: 125, isActive: true },
  { _id: '3', name: 'Films', description: 'Movie trivia and cinema knowledge', questionCount: 125, isActive: true }
];

const mockQuestions = {
  '1': [
    { _id: 'q1', questionText: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correctAnswerIndex: 2 },
    { _id: 'q2', questionText: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctAnswerIndex: 1 }
  ],
  '2': [
    { _id: 'q3', questionText: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctAnswerIndex: 2 },
    { _id: 'q4', questionText: 'How many bones are in the adult human body?', options: ['206', '208', '210', '212'], correctAnswerIndex: 0 }
  ],
  '3': [
    { _id: 'q5', questionText: 'Who directed the movie "Jaws"?', options: ['George Lucas', 'Steven Spielberg', 'Martin Scorsese', 'Francis Ford Coppola'], correctAnswerIndex: 1 },
    { _id: 'q6', questionText: 'Which movie won Best Picture in 1994?', options: ['Forrest Gump', 'The Lion King', 'Pulp Fiction', 'The Shawshank Redemption'], correctAnswerIndex: 0 }
  ]
};

// Mock auth endpoints
app.post('/api/v1/auth/register', (req, res) => {
  const { userId, password, email } = req.body;
  
  if (mockUsers.has(userId)) {
    return res.status(409).json({
      success: false,
      error: { code: 'USER_ID_EXISTS', message: 'User ID already exists' }
    });
  }
  
  mockUsers.set(userId, { userId, email, password });
  res.status(201).json({
    success: true,
    data: {
      user: { userId, email },
      token: 'mock-jwt-token'
    }
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { userId, password } = req.body;
  const user = mockUsers.get(userId);
  
  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' }
    });
  }
  
  res.json({
    success: true,
    data: {
      user: { userId: user.userId, email: user.email },
      token: 'mock-jwt-token'
    }
  });
});

// Mock quiz endpoints
app.get('/api/v1/quiz/topics', (req, res) => {
  const topics = mockTopics.map(topic => ({
    ...topic,
    userAttempts: 0,
    maxAttempts: 3,
    canRetake: true,
    bestScore: 0
  }));
  
  res.json({
    success: true,
    data: { topics }
  });
});

app.post('/api/v1/quiz/start', (req, res) => {
  const { topicId } = req.body;
  const questions = mockQuestions[topicId] || mockQuestions['1'];
  
  res.json({
    success: true,
    data: {
      quizAttemptId: 'mock-attempt-' + Date.now(),
      topicName: mockTopics.find(t => t._id === topicId)?.name || 'General Knowledge',
      questions: questions.slice(0, 2), // Return 2 questions for demo
      totalQuestions: 2,
      timePerQuestion: 20,
      attemptNumber: 1
    }
  });
});

// Mock analytics endpoint
app.get('/api/v1/analytics/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      overallStats: {
        totalQuizzes: 0,
        averageScore: 0,
        averageResponseTime: 0,
        totalCorrectAnswers: 0,
        totalQuestions: 0,
        unattemptedQuestions: 0
      },
      recentQuizzes: [],
      topicStats: []
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Quiz App API is running (Standalone Mode - No MongoDB)',
    mode: 'standalone'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Endpoint not found' }
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (Standalone Mode)`);
  console.log('📝 Note: Running without MongoDB - using mock data');
  console.log('🌐 Health check: http://localhost:${PORT}/health');
});
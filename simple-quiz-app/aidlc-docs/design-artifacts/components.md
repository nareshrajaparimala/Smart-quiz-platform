# Component Architecture

## System Overview
The Quiz Application follows a 3-tier architecture with React frontend, Node.js backend, and MongoDB database, designed for deployment on GCP and on-premises with Docker containerization.

## Frontend Components (React)

### 1. Authentication Components
#### LoginComponent
- **Responsibility**: User ID and password authentication
- **Features**: User ID validation, password input, forgot password link
- **Dependencies**: AuthService, ValidationUtils
- **State**: userId, password, isLoading, errors

#### ForgotPasswordComponent  
- **Responsibility**: Password recovery via email verification
- **Features**: Email input, verification code, password reset
- **Dependencies**: AuthService, EmailService
- **State**: email, verificationCode, newPassword, step

### 2. Dashboard Components
#### DashboardContainer
- **Responsibility**: Main dashboard layout and data orchestration
- **Features**: User performance overview, navigation
- **Dependencies**: QuizService, AnalyticsService, UserService
- **State**: userStats, recentQuizzes, topicPerformance

#### ScoreHistoryComponent
- **Responsibility**: Display last 5 quiz scores with growth tracking
- **Features**: Score list, trend visualization, pagination for 5+ quizzes
- **Dependencies**: QuizService
- **State**: recentScores, allScores, showGrowthView

#### PerformanceStatsComponent
- **Responsibility**: Overall and topic-wise performance metrics
- **Features**: Average scores, topic breakdown, response time analytics
- **Dependencies**: AnalyticsService
- **State**: overallStats, topicStats, responseTimeStats

#### ExportComponent
- **Responsibility**: PDF generation and download functionality
- **Features**: Report generation, download button, format options
- **Dependencies**: PDFService, ReportService
- **State**: isGenerating, reportData

### 3. Quiz Components
#### TopicSelectionComponent
- **Responsibility**: Quiz topic selection interface
- **Features**: Topic list, topic descriptions, selection validation
- **Dependencies**: TopicService
- **State**: availableTopics, selectedTopic, retakeAttempts

#### QuizContainer
- **Responsibility**: Quiz flow orchestration and state management
- **Features**: Question progression, timer management, score calculation
- **Dependencies**: QuizService, TimerService
- **State**: currentQuestion, questionIndex, timeRemaining, answers, score

#### QuestionComponent
- **Responsibility**: Individual question display and interaction
- **Features**: Question text, answer options, multimedia support, selection
- **Dependencies**: MediaService
- **State**: selectedAnswer, isAnswered, mediaLoaded

#### TimerComponent
- **Responsibility**: 20-second countdown timer display
- **Features**: Visual countdown, auto-progression, time warnings
- **Dependencies**: TimerService
- **State**: timeRemaining, isExpired, warningThreshold

#### ResultsComponent
- **Responsibility**: Quiz results and review interface
- **Features**: Final score, correct answers review, performance analysis
- **Dependencies**: QuizService, AnalyticsService
- **State**: quizResults, correctAnswers, userAnswers, analysis

### 4. Shared Components
#### LoadingComponent
- **Responsibility**: Loading states and progress indicators
- **Features**: Spinner, progress bars, loading messages

#### ErrorBoundaryComponent
- **Responsibility**: Error handling and user feedback
- **Features**: Error display, retry mechanisms, fallback UI

#### NavigationComponent
- **Responsibility**: Application navigation and routing
- **Features**: Route management, breadcrumbs, back navigation

## Backend Components (Node.js)

### 1. API Layer
#### AuthController
- **Responsibility**: Authentication and authorization endpoints
- **Endpoints**: /auth/login, /auth/forgot-password, /auth/reset-password
- **Dependencies**: AuthService, EmailService, ValidationMiddleware

#### UserController
- **Responsibility**: User management and profile operations
- **Endpoints**: /users/profile, /users/stats, /users/validate-id
- **Dependencies**: UserService, AnalyticsService

#### QuizController
- **Responsibility**: Quiz operations and question management
- **Endpoints**: /quiz/start, /quiz/submit, /quiz/results, /quiz/topics
- **Dependencies**: QuizService, QuestionService, AnalyticsService

#### AnalyticsController
- **Responsibility**: Performance tracking and reporting
- **Endpoints**: /analytics/user-stats, /analytics/question-performance, /analytics/export
- **Dependencies**: AnalyticsService, ReportService

### 2. Service Layer
#### AuthService
- **Responsibility**: Authentication logic and session management
- **Features**: Password hashing, JWT tokens, session validation
- **Dependencies**: UserRepository, EmailService, CryptoUtils

#### UserService
- **Responsibility**: User data management and validation
- **Features**: User CRUD operations, ID uniqueness validation, profile management
- **Dependencies**: UserRepository, ValidationUtils

#### QuizService
- **Responsibility**: Quiz business logic and flow management
- **Features**: Random question selection, scoring, retake logic, attempt tracking
- **Dependencies**: QuizRepository, QuestionRepository, AnalyticsService

#### QuestionService
- **Responsibility**: Question bank management and randomization
- **Features**: Question retrieval, answer shuffling, multimedia handling
- **Dependencies**: QuestionRepository, MediaService

#### AnalyticsService
- **Responsibility**: Performance tracking and metrics calculation
- **Features**: Question-level analytics, user performance, unattempted question tracking
- **Dependencies**: AnalyticsRepository, QuizRepository

#### EmailService
- **Responsibility**: Email notifications and verification
- **Features**: Password reset emails, verification codes, email templates
- **Dependencies**: EmailProvider, TemplateEngine

#### PDFService
- **Responsibility**: Report generation and PDF creation
- **Features**: Score reports, performance analytics, export formatting
- **Dependencies**: PDFGenerator, ReportService

#### MediaService
- **Responsibility**: Multimedia content handling
- **Features**: Image/video serving, content validation, file management
- **Dependencies**: FileStorage, ContentValidator

### 3. Repository Layer
#### UserRepository
- **Responsibility**: User data persistence operations
- **Features**: User CRUD, authentication data, profile management
- **Database**: MongoDB users collection

#### QuizRepository
- **Responsibility**: Quiz attempt and result persistence
- **Features**: Quiz history, scoring data, attempt tracking
- **Database**: MongoDB quizzes collection

#### QuestionRepository
- **Responsibility**: Question bank data management
- **Features**: Question retrieval, topic management, multimedia references
- **Database**: MongoDB questions collection

#### AnalyticsRepository
- **Responsibility**: Performance metrics and analytics data
- **Features**: Question performance, user statistics, system metrics
- **Database**: MongoDB analytics collection

### 4. Middleware Components
#### AuthMiddleware
- **Responsibility**: Request authentication and authorization
- **Features**: JWT validation, session management, route protection

#### ValidationMiddleware
- **Responsibility**: Request data validation and sanitization
- **Features**: Input validation, data sanitization, error handling

#### RateLimitMiddleware
- **Responsibility**: API rate limiting and abuse prevention
- **Features**: Request throttling, IP-based limiting, quota management

#### ErrorHandlingMiddleware
- **Responsibility**: Centralized error handling and logging
- **Features**: Error formatting, logging, client-safe error responses

## Database Components (MongoDB)

### Collections Schema

#### users
```javascript
{
  _id: ObjectId,
  userId: String (unique, alphanumeric),
  password: String (hashed),
  email: String,
  createdAt: Date,
  lastLoginAt: Date,
  isActive: Boolean
}
```

#### quizzes
```javascript
{
  _id: ObjectId,
  userId: String,
  topic: String,
  questions: [ObjectId],
  answers: [Object],
  score: Number,
  totalQuestions: Number,
  completedAt: Date,
  timeSpent: Number,
  attemptNumber: Number
}
```

#### questions
```javascript
{
  _id: ObjectId,
  topic: String,
  questionText: String,
  options: [String],
  correctAnswer: Number,
  mediaUrl: String (optional),
  mediaType: String (optional),
  difficulty: String,
  createdAt: Date
}
```

#### analytics
```javascript
{
  _id: ObjectId,
  userId: String,
  questionId: ObjectId,
  isCorrect: Boolean,
  responseTime: Number,
  wasAttempted: Boolean,
  quizId: ObjectId,
  timestamp: Date
}
```

## Component Dependencies

### Frontend Dependencies
```
LoginComponent → AuthService → AuthController
DashboardContainer → QuizService, AnalyticsService → QuizController, AnalyticsController
QuizContainer → QuizService, TimerService → QuizController
ResultsComponent → QuizService, AnalyticsService → QuizController, AnalyticsController
ExportComponent → PDFService → AnalyticsController
```

### Backend Dependencies
```
Controllers → Services → Repositories → MongoDB
AuthController → AuthService → UserRepository → users collection
QuizController → QuizService → QuizRepository, QuestionRepository → quizzes, questions collections
AnalyticsController → AnalyticsService → AnalyticsRepository → analytics collection
```

### Cross-Layer Dependencies
```
React Components → REST API → Node.js Controllers → Services → MongoDB
Timer Management → WebSocket (optional) → Real-time updates
PDF Generation → Server-side rendering → File download
Email Service → External SMTP → Email delivery
```

## Deployment Components

### Docker Containers
#### Frontend Container
- **Base**: Node.js Alpine
- **Content**: React build artifacts, Nginx server
- **Ports**: 80, 443
- **Dependencies**: Backend API container

#### Backend Container  
- **Base**: Node.js Alpine
- **Content**: Node.js application, API endpoints
- **Ports**: 3000
- **Dependencies**: MongoDB container, Email service

#### Database Container
- **Base**: MongoDB official image
- **Content**: MongoDB instance, data persistence
- **Ports**: 27017
- **Dependencies**: Persistent volume storage

### Infrastructure Components
#### Load Balancer
- **Responsibility**: Traffic distribution and SSL termination
- **Features**: Health checks, auto-scaling, SSL certificates

#### Monitoring Stack
- **Components**: Application metrics, error tracking, performance monitoring
- **Features**: Real-time dashboards, alerting, log aggregation

#### Backup System
- **Responsibility**: Data backup and disaster recovery
- **Features**: Automated backups, point-in-time recovery, data retention policies
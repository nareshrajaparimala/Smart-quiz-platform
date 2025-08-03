# Domain Model

## Core Domain Entities

### 1. User Entity
```javascript
User {
  _id: ObjectId,
  userId: String (unique, alphanumeric, 3-20 chars),
  password: String (hashed, bcrypt),
  email: String (for password recovery),
  createdAt: Date,
  lastLoginAt: Date,
  isActive: Boolean,
  retentionExpiry: Date (createdAt + 1 month)
}
```

**Business Rules:**
- User ID must be unique across the system
- User ID format: alphanumeric characters only (3-20 characters)
- Password must be hashed using bcrypt
- Email required for password recovery functionality
- User data expires after 1 month (retention policy)
- User can recreate account with same ID after expiry

**Relationships:**
- One-to-Many with QuizAttempt
- One-to-Many with QuestionResponse
- One-to-One with UserPerformance

### 2. Topic Entity
```javascript
Topic {
  _id: ObjectId,
  name: String (unique),
  description: String,
  isActive: Boolean,
  questionCount: Number,
  createdAt: Date
}
```

**Business Rules:**
- Each topic must have at least 100 questions for random selection
- Topic names: "General Knowledge", "Science", "Films" (Phase 1)
- Topics are managed through data scripts (no admin interface in Phase 1)

**Relationships:**
- One-to-Many with Question
- One-to-Many with QuizAttempt

### 3. Question Entity
```javascript
Question {
  _id: ObjectId,
  topicId: ObjectId,
  questionText: String,
  options: [String] (exactly 4 options),
  correctAnswerIndex: Number (0-3),
  mediaUrl: String (optional, for future multimedia),
  mediaType: String (optional, 'image'|'video'),
  difficulty: String (default: 'medium'),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Business Rules:**
- Each question must have exactly 4 answer options
- Only one correct answer per question
- Answer options are randomized during quiz presentation
- Multimedia support (images/videos) for future enhancement
- Questions are text-based in Phase 1

**Relationships:**
- Many-to-One with Topic
- One-to-Many with QuestionResponse

### 4. QuizAttempt Entity
```javascript
QuizAttempt {
  _id: ObjectId,
  userId: String,
  topicId: ObjectId,
  questions: [ObjectId] (exactly 10 questions),
  startedAt: Date,
  completedAt: Date,
  score: Number (0-10),
  totalQuestions: Number (always 10),
  timeSpent: Number (seconds),
  attemptNumber: Number (1-3 per topic until 50%+ score),
  isCompleted: Boolean,
  passedThreshold: Boolean (score >= 5)
}
```

**Business Rules:**
- Each quiz contains exactly 10 randomly selected questions
- Maximum 3 attempts per topic until achieving 50%+ score (≥5 points)
- After achieving 50%+, unlimited attempts allowed
- Quiz progress is not saved if browser is closed
- Questions are randomly selected from topic's question bank
- No duplicate questions within same quiz attempt

**Relationships:**
- Many-to-One with User (via userId)
- Many-to-One with Topic
- One-to-Many with QuestionResponse

### 5. QuestionResponse Entity
```javascript
QuestionResponse {
  _id: ObjectId,
  userId: String,
  quizAttemptId: ObjectId,
  questionId: ObjectId,
  selectedAnswerIndex: Number (0-3, null if unattempted),
  isCorrect: Boolean,
  responseTime: Number (seconds, max 20),
  wasAttempted: Boolean,
  timestamp: Date
}
```

**Business Rules:**
- Each question has maximum 20 seconds response time
- Unattempted questions (timer expired) marked as incorrect
- Response time tracked for analytics
- Only one answer selection allowed per question

**Relationships:**
- Many-to-One with User (via userId)
- Many-to-One with QuizAttempt
- Many-to-One with Question

### 6. UserPerformance Entity (Analytics)
```javascript
UserPerformance {
  _id: ObjectId,
  userId: String,
  overallStats: {
    totalQuizzes: Number,
    averageScore: Number,
    averageResponseTime: Number,
    totalCorrectAnswers: Number,
    totalQuestions: Number,
    unattemptedQuestions: Number
  },
  topicStats: [{
    topicId: ObjectId,
    topicName: String,
    quizzesTaken: Number,
    averageScore: Number,
    averageResponseTime: Number,
    bestScore: Number,
    lastAttemptDate: Date,
    currentAttemptCount: Number
  }],
  recentQuizzes: [{
    quizAttemptId: ObjectId,
    topicName: String,
    score: Number,
    completedAt: Date,
    timeSpent: Number
  }] (last 5, or all if growth tracking enabled),
  lastUpdated: Date
}
```

**Business Rules:**
- Performance data updated after each quiz completion
- Recent quizzes limited to last 5 (unless growth tracking enabled for 5+ attempts)
- Growth tracking: maintain all quiz history when user has 5+ attempts
- Analytics data expires with user data (1-month retention)

**Relationships:**
- One-to-One with User (via userId)

## Entity Relationships Diagram

```
User (1) ←→ (M) QuizAttempt (1) ←→ (M) QuestionResponse (M) ←→ (1) Question (M) ←→ (1) Topic
  ↓                                                                                    ↑
  (1)                                                                                  ↓
  ↓                                                                              (referenced)
UserPerformance                                                                       ↓
                                                                              TopicStats
```

## Business Rules & Constraints

### User Management Rules
1. **Unique User ID**: System enforces uniqueness across all active users
2. **Password Recovery**: Email-based verification for password reset
3. **Data Retention**: User data automatically expires after 1 month
4. **Session Management**: No persistent sessions, user must login each time

### Quiz Attempt Rules
1. **Question Selection**: Exactly 10 questions randomly selected per quiz
2. **Retake Logic**: Maximum 3 attempts per topic until 50%+ score achieved
3. **Time Limits**: 20 seconds per question, auto-progression on timeout
4. **Scoring**: 1 point per correct answer, 0 points for incorrect/unattempted
5. **Progress**: No saving of incomplete quizzes (browser closure loses progress)

### Performance Tracking Rules
1. **Analytics Granularity**: Track individual question responses and timing
2. **Unattempted Questions**: Separately track questions not answered due to timeout
3. **Growth Tracking**: Maintain extended history for users with 5+ quiz attempts
4. **Real-time Updates**: Performance statistics update immediately after quiz completion

### Data Validation Rules
1. **User ID Format**: Alphanumeric characters, 3-20 characters length
2. **Email Format**: Valid email address for password recovery
3. **Quiz Completion**: All 10 questions must be processed (attempted or timed out)
4. **Score Range**: Quiz scores between 0-10 inclusive
5. **Response Time**: Maximum 20 seconds per question response

## Data Lifecycle Management

### User Data Lifecycle
```
Registration → Active Use → 1 Month Retention → Automatic Expiry → Data Deletion
```

### Quiz Data Lifecycle
```
Quiz Start → Question Responses → Quiz Completion → Analytics Update → Historical Storage
```

### Performance Data Lifecycle
```
Quiz Completion → Stats Calculation → Performance Update → Dashboard Display → Export Available
```

## MongoDB Schema Design

### Indexes
```javascript
// Users Collection
db.users.createIndex({ "userId": 1 }, { unique: true })
db.users.createIndex({ "email": 1 })
db.users.createIndex({ "retentionExpiry": 1 }, { expireAfterSeconds: 0 })

// Questions Collection
db.questions.createIndex({ "topicId": 1 })
db.questions.createIndex({ "isActive": 1 })

// QuizAttempts Collection
db.quizAttempts.createIndex({ "userId": 1 })
db.quizAttempts.createIndex({ "topicId": 1 })
db.quizAttempts.createIndex({ "completedAt": -1 })

// QuestionResponses Collection
db.questionResponses.createIndex({ "userId": 1 })
db.questionResponses.createIndex({ "quizAttemptId": 1 })
db.questionResponses.createIndex({ "questionId": 1 })

// UserPerformance Collection
db.userPerformance.createIndex({ "userId": 1 }, { unique: true })
```

### Data Aggregation Patterns
```javascript
// Calculate user's average score
db.quizAttempts.aggregate([
  { $match: { userId: "user123", isCompleted: true } },
  { $group: { _id: "$userId", avgScore: { $avg: "$score" } } }
])

// Get topic-wise performance
db.quizAttempts.aggregate([
  { $match: { userId: "user123" } },
  { $lookup: { from: "topics", localField: "topicId", foreignField: "_id", as: "topic" } },
  { $group: { _id: "$topicId", avgScore: { $avg: "$score" }, count: { $sum: 1 } } }
])

// Track unattempted questions
db.questionResponses.aggregate([
  { $match: { userId: "user123", wasAttempted: false } },
  { $count: "unattemptedCount" }
])
```

## Domain Services

### QuizOrchestrationService
**Responsibilities:**
- Manage quiz attempt lifecycle
- Enforce retake rules and attempt limits
- Coordinate question selection and randomization
- Handle quiz completion and scoring

### PerformanceAnalyticsService
**Responsibilities:**
- Calculate user performance metrics
- Track question-level analytics
- Manage growth tracking for high-activity users
- Generate performance reports

### RetentionManagementService
**Responsibilities:**
- Enforce 1-month data retention policy
- Clean up expired user data
- Manage data archival and deletion
- Handle user data export before deletion

### ValidationService
**Responsibilities:**
- Validate user input formats
- Enforce business rule constraints
- Sanitize data before persistence
- Validate quiz attempt eligibility

## State Transitions

### User State Transitions
```
[New] → Register → [Active] → 30 days → [Expired] → Cleanup → [Deleted]
                      ↓
                   Login → [Authenticated] → Logout → [Active]
```

### Quiz Attempt State Transitions
```
[Not Started] → Start Quiz → [In Progress] → Complete/Abandon → [Completed/Abandoned]
                                ↓
                           Question Timer → Timeout → [Auto-Progress]
```

### Question Response State Transitions
```
[Presented] → User Selection → [Answered] → Submit → [Recorded]
      ↓
   20s Timer → Timeout → [Unattempted] → Auto-Submit → [Recorded]
```

This domain model provides the foundation for implementing the quiz application with proper data relationships, business rules, and lifecycle management.
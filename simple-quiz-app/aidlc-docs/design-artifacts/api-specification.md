# API Specification

## Base Configuration
- **Base URL**: `https://api.quizapp.com/v1`
- **Protocol**: HTTPS
- **Content-Type**: `application/json`
- **Authentication**: JWT Bearer Token
- **Rate Limiting**: 100 requests/minute per user

## Authentication Endpoints

### POST /auth/login
**Description**: Authenticate user with ID and password

**Request Body**:
```json
{
  "userId": "string (3-20 alphanumeric chars)",
  "password": "string (min 8 chars)"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_string",
    "user": {
      "userId": "user123",
      "email": "user@example.com",
      "lastLoginAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Response 401**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid user ID or password"
  }
}
```

**Response 409**:
```json
{
  "success": false,
  "error": {
    "code": "USER_ID_EXISTS",
    "message": "User ID already exists. Please choose a different ID."
  }
}
```

### POST /auth/register
**Description**: Register new user with unique ID

**Request Body**:
```json
{
  "userId": "string (3-20 alphanumeric chars)",
  "password": "string (min 8 chars)",
  "email": "string (valid email format)"
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "message": "User registered successfully"
  }
}
```

### POST /auth/forgot-password
**Description**: Initiate password recovery process

**Request Body**:
```json
{
  "email": "string (valid email)"
}
```

**Response 200**:
```json
{
  "success": true,
  "message": "Password recovery email sent"
}
```

### POST /auth/reset-password
**Description**: Reset password with verification code

**Request Body**:
```json
{
  "email": "string",
  "verificationCode": "string (6 digits)",
  "newPassword": "string (min 8 chars)"
}
```

**Response 200**:
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

## User Management Endpoints

### GET /users/profile
**Description**: Get current user profile and statistics
**Authentication**: Required

**Response 200**:
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLoginAt": "2024-01-15T10:30:00Z",
    "retentionExpiry": "2024-02-01T00:00:00Z"
  }
}
```

### POST /users/validate-id
**Description**: Check if user ID is available

**Request Body**:
```json
{
  "userId": "string"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "available": true
  }
}
```

## Quiz Management Endpoints

### GET /quiz/topics
**Description**: Get available quiz topics
**Authentication**: Required

**Response 200**:
```json
{
  "success": true,
  "data": {
    "topics": [
      {
        "_id": "topic_id_1",
        "name": "General Knowledge",
        "description": "Test your general knowledge",
        "questionCount": 150,
        "userAttempts": 2,
        "maxAttempts": 3,
        "canRetake": true,
        "bestScore": 7
      }
    ]
  }
}
```

### POST /quiz/start
**Description**: Start a new quiz for selected topic
**Authentication**: Required

**Request Body**:
```json
{
  "topicId": "string (ObjectId)"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "quizAttemptId": "attempt_id_123",
    "topicName": "General Knowledge",
    "questions": [
      {
        "_id": "question_id_1",
        "questionText": "What is the capital of France?",
        "options": ["London", "Berlin", "Paris", "Madrid"],
        "mediaUrl": null,
        "mediaType": null
      }
    ],
    "totalQuestions": 10,
    "timePerQuestion": 20,
    "attemptNumber": 1
  }
}
```

**Response 403**:
```json
{
  "success": false,
  "error": {
    "code": "MAX_ATTEMPTS_REACHED",
    "message": "Maximum 3 attempts reached for this topic. Score 50% or higher to unlock unlimited attempts."
  }
}
```

### POST /quiz/submit-answer
**Description**: Submit answer for current question
**Authentication**: Required

**Request Body**:
```json
{
  "quizAttemptId": "string",
  "questionId": "string",
  "selectedAnswerIndex": "number (0-3)",
  "responseTime": "number (seconds)"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "isCorrect": true,
    "nextQuestion": {
      "_id": "question_id_2",
      "questionText": "Next question text...",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
    },
    "progress": {
      "currentQuestion": 2,
      "totalQuestions": 10
    }
  }
}
```

### POST /quiz/complete
**Description**: Complete quiz and get final results
**Authentication**: Required

**Request Body**:
```json
{
  "quizAttemptId": "string"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "quizResults": {
      "score": 7,
      "totalQuestions": 10,
      "percentage": 70,
      "timeSpent": 180,
      "passed": true
    },
    "questionReview": [
      {
        "questionId": "q1",
        "questionText": "What is the capital of France?",
        "options": ["London", "Berlin", "Paris", "Madrid"],
        "correctAnswerIndex": 2,
        "userAnswerIndex": 2,
        "isCorrect": true,
        "responseTime": 15
      }
    ],
    "performance": {
      "averageResponseTime": 18,
      "unattemptedQuestions": 1
    }
  }
}
```

## Analytics Endpoints

### GET /analytics/dashboard
**Description**: Get user dashboard analytics
**Authentication**: Required

**Response 200**:
```json
{
  "success": true,
  "data": {
    "overallStats": {
      "totalQuizzes": 15,
      "averageScore": 6.8,
      "averageResponseTime": 16.5,
      "totalCorrectAnswers": 102,
      "totalQuestions": 150,
      "unattemptedQuestions": 8
    },
    "recentQuizzes": [
      {
        "quizAttemptId": "attempt_123",
        "topicName": "Science",
        "score": 8,
        "completedAt": "2024-01-15T14:30:00Z",
        "timeSpent": 195
      }
    ],
    "topicStats": [
      {
        "topicId": "topic_1",
        "topicName": "General Knowledge",
        "quizzesTaken": 5,
        "averageScore": 7.2,
        "averageResponseTime": 15.8,
        "bestScore": 9,
        "lastAttemptDate": "2024-01-14T10:00:00Z",
        "currentAttemptCount": 2
      }
    ]
  }
}
```

### GET /analytics/question-performance
**Description**: Get detailed question-level performance analytics
**Authentication**: Required

**Query Parameters**:
- `topicId` (optional): Filter by specific topic
- `limit` (optional): Number of results (default: 50)

**Response 200**:
```json
{
  "success": true,
  "data": {
    "questionPerformance": [
      {
        "questionId": "q1",
        "questionText": "What is the capital of France?",
        "topicName": "General Knowledge",
        "timesAttempted": 3,
        "timesCorrect": 2,
        "accuracyRate": 66.7,
        "averageResponseTime": 14.5,
        "lastAttempted": "2024-01-15T10:30:00Z"
      }
    ],
    "summary": {
      "totalQuestionsAttempted": 45,
      "overallAccuracy": 68.9,
      "averageResponseTime": 16.2
    }
  }
}
```

### GET /analytics/export
**Description**: Generate and download performance report as PDF
**Authentication**: Required

**Query Parameters**:
- `format`: "pdf" (default)
- `period`: "all" | "last30days" | "last7days"

**Response 200**:
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://api.quizapp.com/v1/files/reports/user123_report_20240115.pdf",
    "expiresAt": "2024-01-15T18:00:00Z",
    "fileSize": 245760
  }
}
```

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details (optional)",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Common Error Codes
- `INVALID_CREDENTIALS`: Authentication failed
- `USER_ID_EXISTS`: User ID already taken
- `USER_NOT_FOUND`: User does not exist
- `INVALID_TOKEN`: JWT token invalid or expired
- `MAX_ATTEMPTS_REACHED`: Quiz retake limit exceeded
- `QUIZ_NOT_FOUND`: Quiz attempt not found
- `VALIDATION_ERROR`: Request data validation failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (access denied)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error

## Request/Response Headers

### Required Request Headers
```
Content-Type: application/json
Authorization: Bearer <jwt_token> (for protected endpoints)
User-Agent: QuizApp/1.0
```

### Response Headers
```
Content-Type: application/json
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
X-Request-ID: req_123456789
```

## Rate Limiting

### Limits by Endpoint Type
- **Authentication**: 10 requests/minute
- **Quiz Operations**: 60 requests/minute
- **Analytics**: 30 requests/minute
- **General**: 100 requests/minute

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```

## Data Validation Rules

### User ID Validation
- Format: Alphanumeric characters only
- Length: 3-20 characters
- Case: Case-sensitive
- Pattern: `^[a-zA-Z0-9]{3,20}$`

### Password Validation
- Minimum length: 8 characters
- Must contain: letters and numbers
- Special characters: allowed but not required

### Email Validation
- Standard email format validation
- Maximum length: 254 characters
- Required for password recovery

### Quiz Data Validation
- Answer index: 0-3 (integer)
- Response time: 0-20 seconds (number)
- Quiz attempt ID: Valid ObjectId format

## WebSocket Events (Optional Enhancement)

### Real-time Timer Updates
```javascript
// Client subscribes to timer events
socket.emit('join-quiz', { quizAttemptId: 'attempt_123' })

// Server sends timer updates
socket.emit('timer-update', { 
  timeRemaining: 15,
  questionId: 'q1'
})

// Auto-progression on timeout
socket.emit('question-timeout', {
  questionId: 'q1',
  nextQuestion: { ... }
})
```

## API Versioning

### Version Strategy
- URL-based versioning: `/v1/`, `/v2/`
- Current version: `v1`
- Backward compatibility: Maintained for 1 major version

### Version Headers
```
API-Version: v1
Supported-Versions: v1
```

## Security Considerations

### Authentication Security
- JWT tokens expire after 24 hours
- Refresh tokens not implemented (stateless design)
- Password hashing: bcrypt with salt rounds 12

### Input Sanitization
- All inputs validated and sanitized
- SQL injection prevention (NoSQL injection for MongoDB)
- XSS prevention through output encoding

### CORS Configuration
```javascript
{
  origin: ['https://quizapp.com', 'https://www.quizapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}
```

This API specification provides comprehensive documentation for all endpoints required by the quiz application, including authentication, quiz management, analytics, and error handling.
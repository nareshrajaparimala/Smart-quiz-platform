# Component-Story Mapping

## User Story to Component Matrix

### Authentication & Access Stories

#### US-001: User ID Entry
**Components:**
- **Frontend**: LoginComponent
- **Backend**: AuthController, UserService, ValidationMiddleware
- **Database**: UserRepository → users collection
- **Features**: User ID input validation, alphanumeric format checking

#### US-002: User ID Validation  
**Components:**
- **Frontend**: LoginComponent (error display)
- **Backend**: UserService (uniqueness check), ValidationMiddleware
- **Database**: UserRepository → users collection
- **Features**: Duplicate ID detection, error messaging

#### US-003: Session-Based Access
**Components:**
- **Frontend**: LoginComponent, AuthService
- **Backend**: AuthController, AuthService, AuthMiddleware
- **Database**: Session management (in-memory/Redis)
- **Features**: Session creation, validation, cleanup

### Dashboard & Performance Stories

#### US-004: Dashboard Overview
**Components:**
- **Frontend**: DashboardContainer, NavigationComponent
- **Backend**: UserController, AnalyticsController
- **Database**: AnalyticsRepository → analytics collection
- **Features**: Performance data aggregation, responsive layout

#### US-005: Recent Quiz Scores
**Components:**
- **Frontend**: ScoreHistoryComponent
- **Backend**: QuizController, QuizService
- **Database**: QuizRepository → quizzes collection
- **Features**: Last 5 scores retrieval, chronological ordering

#### US-006: Average Score Display
**Components:**
- **Frontend**: PerformanceStatsComponent
- **Backend**: AnalyticsService, AnalyticsController
- **Database**: AnalyticsRepository → analytics collection
- **Features**: Score calculation, real-time updates

#### US-007: Topic Performance Statistics
**Components:**
- **Frontend**: PerformanceStatsComponent
- **Backend**: AnalyticsService, AnalyticsController
- **Database**: AnalyticsRepository → analytics collection, QuizRepository
- **Features**: Topic-wise analytics, performance visualization

#### US-008: Average Response Time
**Components:**
- **Frontend**: PerformanceStatsComponent
- **Backend**: AnalyticsService, AnalyticsController
- **Database**: AnalyticsRepository → analytics collection
- **Features**: Response time calculation, per-topic breakdown

### Quiz Selection & Initiation Stories

#### US-009: Start New Quiz Button
**Components:**
- **Frontend**: DashboardContainer, NavigationComponent
- **Backend**: QuizController (topic validation)
- **Database**: QuestionRepository → questions collection
- **Features**: Quiz initiation, topic availability check

#### US-010: Topic Selection
**Components:**
- **Frontend**: TopicSelectionComponent
- **Backend**: QuizController, QuestionService
- **Database**: QuestionRepository → questions collection
- **Features**: Topic listing, selection validation, retake attempt checking

#### US-011: Random Question Selection
**Components:**
- **Frontend**: QuizContainer (receives questions)
- **Backend**: QuizService, QuestionService
- **Database**: QuestionRepository → questions collection
- **Features**: Random selection algorithm, duplicate prevention

### Quiz Taking Experience Stories

#### US-012: Question Display
**Components:**
- **Frontend**: QuestionComponent, MediaService
- **Backend**: QuestionService, MediaService
- **Database**: QuestionRepository → questions collection
- **Features**: Question rendering, multimedia support, answer randomization

#### US-013: Answer Selection
**Components:**
- **Frontend**: QuestionComponent
- **Backend**: QuizService (answer tracking)
- **Database**: AnalyticsRepository → analytics collection
- **Features**: Single selection, visual feedback, answer persistence

#### US-014: Question Timer
**Components:**
- **Frontend**: TimerComponent, QuizContainer
- **Backend**: QuizService (time tracking)
- **Database**: AnalyticsRepository → analytics collection
- **Features**: 20-second countdown, visual indicators, accuracy tracking

#### US-015: Timer Expiration Handling
**Components:**
- **Frontend**: TimerComponent, QuizContainer
- **Backend**: QuizService, AnalyticsService
- **Database**: AnalyticsRepository → analytics collection
- **Features**: Auto-progression, unattempted question tracking

#### US-016: Forward-Only Navigation
**Components:**
- **Frontend**: QuizContainer, NavigationComponent
- **Backend**: QuizService (progress tracking)
- **Database**: QuizRepository → quizzes collection
- **Features**: Navigation control, progress persistence

#### US-017: Quiz Progress Indicator
**Components:**
- **Frontend**: QuizContainer, NavigationComponent
- **Backend**: QuizService
- **Database**: QuizRepository → quizzes collection
- **Features**: Progress calculation, visual indicators

### Scoring & Results Stories

#### US-018: Score Calculation
**Components:**
- **Frontend**: QuizContainer, ResultsComponent
- **Backend**: QuizService, AnalyticsService
- **Database**: QuizRepository → quizzes collection, AnalyticsRepository
- **Features**: Real-time scoring, accuracy calculation

#### US-019: Final Score Display
**Components:**
- **Frontend**: ResultsComponent
- **Backend**: QuizService, AnalyticsService
- **Database**: QuizRepository → quizzes collection
- **Features**: Score presentation, performance summary

#### US-020: Correct Answer Review
**Components:**
- **Frontend**: ResultsComponent
- **Backend**: QuizService, QuestionService
- **Database**: QuestionRepository → questions collection, QuizRepository
- **Features**: Answer comparison, learning feedback

#### US-021: Results Storage
**Components:**
- **Frontend**: ResultsComponent (confirmation)
- **Backend**: QuizService, AnalyticsService
- **Database**: QuizRepository → quizzes collection, AnalyticsRepository
- **Features**: Data persistence, history management

### Error Handling Stories

#### US-022: Duplicate User ID Error
**Components:**
- **Frontend**: LoginComponent, ErrorBoundaryComponent
- **Backend**: UserService, ValidationMiddleware, ErrorHandlingMiddleware
- **Database**: UserRepository → users collection
- **Features**: Error detection, user guidance, retry mechanism

#### US-023: Network Connection Error
**Components:**
- **Frontend**: ErrorBoundaryComponent, LoadingComponent
- **Backend**: ErrorHandlingMiddleware
- **Database**: Connection monitoring
- **Features**: Connection detection, retry logic, user notification

#### US-024: Quiz Session Loss
**Components:**
- **Frontend**: QuizContainer, ErrorBoundaryComponent
- **Backend**: QuizService, AuthMiddleware
- **Database**: Session management
- **Features**: Session monitoring, data loss prevention, user warnings

### Administrative Stories

#### US-025: Question Bank Setup
**Components:**
- **Backend**: QuestionService, MediaService
- **Database**: QuestionRepository → questions collection
- **Features**: Bulk data import, content validation, multimedia handling

## Component Priority Matrix

### High Priority (MVP Components)
1. **LoginComponent** - Essential for user access
2. **DashboardContainer** - Core user interface
3. **QuizContainer** - Primary application functionality
4. **QuestionComponent** - Core quiz experience
5. **TimerComponent** - Critical for quiz mechanics
6. **AuthController** - Backend authentication
7. **QuizController** - Core quiz logic
8. **UserRepository** - User data management
9. **QuizRepository** - Quiz data persistence

### Medium Priority (Enhanced Features)
1. **PerformanceStatsComponent** - Analytics display
2. **ResultsComponent** - Quiz completion experience
3. **TopicSelectionComponent** - Topic management
4. **AnalyticsService** - Performance tracking
5. **EmailService** - Password recovery
6. **ValidationMiddleware** - Data validation
7. **ErrorHandlingMiddleware** - Error management

### Low Priority (Advanced Features)
1. **ExportComponent** - PDF generation
2. **MediaService** - Multimedia support
3. **PDFService** - Report generation
4. **ForgotPasswordComponent** - Password recovery UI
5. **LoadingComponent** - Enhanced UX
6. **RateLimitMiddleware** - API protection

## Development Sequence

### Phase 1: Core Authentication & Basic Quiz
1. **Week 1-2**: Authentication components and user management
   - LoginComponent, AuthController, UserService, UserRepository
2. **Week 3-4**: Basic quiz functionality
   - QuizContainer, QuestionComponent, QuizController, QuizService
3. **Week 5**: Timer and navigation
   - TimerComponent, NavigationComponent, quiz flow logic

### Phase 2: Dashboard & Analytics
1. **Week 6-7**: Dashboard and performance tracking
   - DashboardContainer, PerformanceStatsComponent, AnalyticsService
2. **Week 8**: Results and scoring
   - ResultsComponent, ScoreHistoryComponent, scoring logic

### Phase 3: Advanced Features
1. **Week 9**: Topic management and retake logic
   - TopicSelectionComponent, retake validation, attempt tracking
2. **Week 10**: Error handling and validation
   - ErrorBoundaryComponent, ValidationMiddleware, error flows
3. **Week 11**: Export and reporting
   - ExportComponent, PDFService, report generation

### Phase 4: Enhancement & Polish
1. **Week 12**: Password recovery and email
   - ForgotPasswordComponent, EmailService, email templates
2. **Week 13**: Performance optimization and monitoring
   - Caching, monitoring, performance tuning
3. **Week 14**: Testing and deployment
   - Docker containers, deployment scripts, testing

## Component Integration Points

### Frontend Integration
```
App → Router → {
  LoginComponent → DashboardContainer → {
    ScoreHistoryComponent,
    PerformanceStatsComponent,
    ExportComponent
  },
  TopicSelectionComponent → QuizContainer → {
    QuestionComponent,
    TimerComponent,
    NavigationComponent
  } → ResultsComponent
}
```

### Backend Integration
```
Express App → Middleware → Controllers → Services → Repositories → MongoDB
AuthMiddleware → All protected routes
ValidationMiddleware → All input endpoints
ErrorHandlingMiddleware → All responses
```

### Data Flow Integration
```
User Action → Frontend Component → API Call → Backend Controller → 
Service Logic → Repository → Database → Response → Frontend Update
```

## Story Coverage Validation

### ✅ Fully Covered Stories
- All 25 user stories have complete component mapping
- Each story maps to specific frontend, backend, and database components
- Component responsibilities align with story requirements

### 🔄 Cross-Story Components
- **QuizService**: Serves multiple quiz-related stories (US-011, US-013, US-015, US-018, US-021)
- **AnalyticsService**: Handles all performance tracking stories (US-006, US-007, US-008)
- **AuthService**: Manages authentication stories (US-001, US-002, US-003)

### 📊 Component Utilization
- **Most Used**: QuizService (8 stories), AnalyticsService (6 stories)
- **Specialized**: TimerComponent (2 stories), ExportComponent (1 story)
- **Foundation**: AuthController, UserRepository (3 stories each)
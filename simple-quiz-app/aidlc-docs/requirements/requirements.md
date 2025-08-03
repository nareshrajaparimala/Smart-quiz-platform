# Quiz Application Requirements

## 1. Overview
A web-based quiz application allowing users to take timed multiple-choice quizzes on various topics without requiring user registration.

## 2. Functional Requirements

### 2.1 User Management
- **FR-001**: Users must enter a unique alphanumeric user ID to start using the application
- **FR-002**: System must validate user ID uniqueness and reject duplicate IDs
- **FR-003**: User ID must be entered for each session (no persistence across browser sessions)

### 2.2 Quiz Topics
- **FR-004**: System must provide multiple quiz topics (General Knowledge, Science, Films)
- **FR-005**: Each topic must contain at least 100 questions in the question bank
- **FR-006**: Topics are managed by administrators through static data scripts (Phase 1)

### 2.3 Question Management
- **FR-007**: Each question must have exactly 4 possible answers with 1 correct answer
- **FR-008**: All questions are text-based (no multimedia support in Phase 1)
- **FR-009**: Questions have no difficulty levels (all treated equally)
- **FR-010**: Answer choices must be randomized for each question presentation

### 2.4 Quiz Flow
- **FR-011**: Each quiz must contain exactly 10 questions
- **FR-012**: Questions must be randomly selected from the chosen topic's question bank
- **FR-013**: Users can only move forward through questions (no backward navigation)
- **FR-014**: Each question has a 20-second timer
- **FR-015**: When timer expires, question is marked as incorrect and moves to next question
- **FR-016**: Quiz progress is not saved if browser is closed (quiz is lost)

### 2.5 Scoring System
- **FR-017**: Each correct answer awards 1 point (maximum 10 points per quiz)
- **FR-018**: Incorrect or timed-out answers award 0 points
- **FR-019**: Final score is displayed at quiz completion

### 2.6 Dashboard Features
- **FR-020**: Dashboard must display last 5 quiz scores
- **FR-021**: Dashboard must show average score across all quizzes taken
- **FR-022**: Dashboard must display topic-wise performance statistics
- **FR-023**: Dashboard must show average time taken to answer questions
- **FR-024**: Users can start new quiz via "Start New Quiz" button

### 2.7 Post-Quiz Features
- **FR-025**: Users must see correct answers after completing a quiz
- **FR-026**: Quiz results must be stored in backend database

## 3. Non-Functional Requirements

### 3.1 Performance Requirements
- **NFR-001**: Quiz questions must load within 2 seconds
- **NFR-002**: Timer must be accurate to within 1 second
- **NFR-003**: Dashboard data must load within 3 seconds

### 3.2 Usability Requirements
- **NFR-004**: Application must be responsive for laptops and mobile devices
- **NFR-005**: Interface must be intuitive requiring no training
- **NFR-006**: Timer must be clearly visible during quiz

### 3.3 Reliability Requirements
- **NFR-007**: System must handle concurrent users without performance degradation
- **NFR-008**: Data integrity must be maintained for all quiz scores
- **NFR-009**: System must be available 99% of the time

### 3.4 Security Requirements
- **NFR-010**: User IDs must be validated to prevent injection attacks
- **NFR-011**: Quiz data must be protected from client-side manipulation
- **NFR-012**: Backend API must validate all requests

### 3.5 Scalability Requirements
- **NFR-013**: System must support up to 1000 concurrent users
- **NFR-014**: Question bank must be easily expandable
- **NFR-015**: New topics can be added without system downtime

### 3.6 Compatibility Requirements
- **NFR-016**: Must work on modern web browsers (Chrome, Firefox, Safari, Edge)
- **NFR-017**: Must be responsive on screen sizes from 320px to 1920px
- **NFR-018**: Requires internet connection (online-only application)

## 4. Technical Specifications

### 4.1 Data Storage
- **TS-001**: Backend database required for persistent data storage
- **TS-002**: Store user quiz history with scores and timestamps
- **TS-003**: Maintain question banks with topics, questions, and answers
- **TS-004**: Store only last 5 actual quiz scores per user
- **TS-005**: Store average scores for all quizzes permanently

### 4.2 System Architecture
- **TS-006**: Web-based responsive application
- **TS-007**: Client-server architecture with REST API
- **TS-008**: Real-time timer implementation required
- **TS-009**: Random question selection algorithm

### 4.3 Data Management
- **TS-010**: Question randomization for each quiz session
- **TS-011**: Answer choice randomization for each question
- **TS-012**: User ID uniqueness validation
- **TS-013**: Quiz session management without persistence

## 5. User Stories

### 5.1 Core User Journey
1. **As a user**, I want to enter my unique ID so that I can access the quiz application
2. **As a user**, I want to see my dashboard with past performance so that I can track my progress
3. **As a user**, I want to start a new quiz by selecting a topic so that I can test my knowledge
4. **As a user**, I want to answer timed questions so that I can complete the quiz efficiently
5. **As a user**, I want to see my final score and correct answers so that I can learn from mistakes

### 5.2 Dashboard Experience
1. **As a user**, I want to see my last 5 quiz scores so that I can track recent performance
2. **As a user**, I want to see my overall average score so that I can measure improvement
3. **As a user**, I want to see topic-wise performance so that I can identify strengths and weaknesses

## 6. Acceptance Criteria

### 6.1 User ID System
- User cannot proceed without entering a valid alphanumeric ID
- System rejects duplicate IDs with clear error message
- User must re-enter ID for each new session

### 6.2 Quiz Mechanics
- Quiz contains exactly 10 randomly selected questions
- Each question displays 4 randomized answer choices
- 20-second countdown timer is visible and functional
- Auto-progression occurs when timer expires
- No backward navigation allowed

### 6.3 Scoring and Results
- Score calculation: 1 point per correct answer
- Final score displayed immediately after quiz completion
- Correct answers shown in results review
- Results stored in user's quiz history

### 6.4 Dashboard Functionality
- Last 5 quiz scores displayed chronologically
- Average score calculated across all quizzes
- Topic performance statistics available
- Average response time metrics shown

## 7. Out of Scope (Phase 1)
- User registration and authentication
- Multimedia questions (images, audio, video)
- Question difficulty levels
- Admin interface for question management
- Offline functionality
- Social features (sharing, leaderboards)
- Accessibility compliance beyond basic responsive design

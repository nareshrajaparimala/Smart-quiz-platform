# User Stories

## User Authentication & Access

### US-001: User ID Entry
**As a user**, I want to enter a unique alphanumeric user ID so that I can access the quiz application.

**Acceptance Criteria:**
- User can enter alphanumeric characters only
- System validates ID format before proceeding
- User cannot access application without valid ID
- Clear input field with appropriate labeling

### US-002: User ID Validation
**As a user**, I want the system to validate my user ID uniqueness so that I have a distinct identity in the application.

**Acceptance Criteria:**
- System checks ID against existing users
- Clear error message displayed for duplicate IDs
- User prompted to enter different ID if duplicate found
- Validation occurs before dashboard access

### US-003: Session-Based Access
**As a user**, I want to enter my user ID each time I visit so that I maintain control over my session.

**Acceptance Criteria:**
- No automatic login or ID persistence
- User must enter ID for each browser session
- Previous session data cleared when browser closed
- Fresh start for each visit

## Dashboard & Performance Tracking

### US-004: Dashboard Overview
**As a user**, I want to see my dashboard with performance data so that I can track my quiz progress.

**Acceptance Criteria:**
- Dashboard displays immediately after ID validation
- Clean, organized layout of performance metrics
- Responsive design for mobile and laptop
- Quick loading of dashboard data

### US-005: Recent Quiz Scores
**As a user**, I want to see my last 5 quiz scores so that I can track my recent performance.

**Acceptance Criteria:**
- Display exactly 5 most recent quiz scores
- Show score, topic, and date for each quiz
- Chronological order (newest first)
- Clear indication if fewer than 5 quizzes taken

### US-006: Average Score Display
**As a user**, I want to see my overall average score so that I can measure my improvement over time.

**Acceptance Criteria:**
- Calculate average across all quizzes taken
- Display as clear numerical value
- Update automatically after each new quiz
- Show "No data" if no quizzes completed

### US-007: Topic Performance Statistics
**As a user**, I want to see my performance by topic so that I can identify my strengths and weaknesses.

**Acceptance Criteria:**
- Display performance for each topic attempted
- Show average score per topic
- Include number of quizzes taken per topic
- Clear visual representation of data

### US-008: Average Response Time
**As a user**, I want to see my average time to answer questions so that I can understand my response patterns.

**Acceptance Criteria:**
- Calculate average response time across all questions
- Display in seconds or appropriate time format
- Update after each quiz completion
- Show per-topic response times if available

## Quiz Selection & Initiation

### US-009: Start New Quiz Button
**As a user**, I want to click a "Start New Quiz" button so that I can begin a new quiz session.

**Acceptance Criteria:**
- Prominent button visible on dashboard
- Clear labeling and intuitive placement
- Button leads to topic selection
- Responsive on all devices

### US-010: Topic Selection
**As a user**, I want to select from available quiz topics so that I can choose subjects that interest me.

**Acceptance Criteria:**
- Display all available topics (General Knowledge, Science, Films)
- Clear topic names and descriptions
- Single-click selection process
- Visual feedback for selected topic

### US-011: Random Question Selection
**As a user**, I want questions to be randomly selected from the topic so that each quiz is unique.

**Acceptance Criteria:**
- System selects exactly 10 questions randomly
- No duplicate questions within same quiz
- Questions drawn from topic's question bank
- Different questions for repeat topic attempts

## Quiz Taking Experience

### US-012: Question Display
**As a user**, I want to see quiz questions with 4 answer choices so that I can select my response.

**Acceptance Criteria:**
- Display one question at a time
- Show exactly 4 answer choices
- Clear question text and readable format
- Answer choices randomized for each question

### US-013: Answer Selection
**As a user**, I want to select one answer from the choices so that I can respond to the question.

**Acceptance Criteria:**
- Single selection allowed per question
- Visual feedback for selected answer
- Ability to change selection before time expires
- Clear indication of selected choice

### US-014: Question Timer
**As a user**, I want to see a 20-second countdown timer so that I know how much time I have to answer.

**Acceptance Criteria:**
- Visible countdown timer showing remaining seconds
- Timer starts when question displays
- Clear visual indication of time remaining
- Timer accurate to within 1 second

### US-015: Timer Expiration Handling
**As a user**, I want the system to automatically move to the next question when time expires so that the quiz continues smoothly.

**Acceptance Criteria:**
- Automatic progression when timer reaches zero
- Current question marked as incorrect
- No user intervention required
- Smooth transition to next question

### US-016: Forward-Only Navigation
**As a user**, I want to move forward through questions only so that I focus on each question individually.

**Acceptance Criteria:**
- No back button or previous question access
- Automatic progression after answer selection or timeout
- Question counter showing progress (e.g., "3 of 10")
- Clear indication of quiz progression

### US-017: Quiz Progress Indicator
**As a user**, I want to see my progress through the quiz so that I know how many questions remain.

**Acceptance Criteria:**
- Display current question number and total
- Visual progress bar or indicator
- Clear and prominent placement
- Updates with each question

## Scoring & Results

### US-018: Score Calculation
**As a user**, I want to receive 1 point for each correct answer so that my score reflects my performance.

**Acceptance Criteria:**
- 1 point awarded for correct answers only
- 0 points for incorrect or timed-out answers
- Maximum possible score of 10 points
- Score calculated automatically

### US-019: Final Score Display
**As a user**, I want to see my final score immediately after completing the quiz so that I know my performance.

**Acceptance Criteria:**
- Score displayed immediately after last question
- Clear numerical format (e.g., "7 out of 10")
- Prominent display on results screen
- Score saved to user history

### US-020: Correct Answer Review
**As a user**, I want to see the correct answers after completing the quiz so that I can learn from my mistakes.

**Acceptance Criteria:**
- Display all 10 questions with correct answers
- Show user's selected answer vs correct answer
- Clear indication of right/wrong responses
- Easy to read format for review

### US-021: Results Storage
**As a user**, I want my quiz results to be saved so that they appear in my dashboard statistics.

**Acceptance Criteria:**
- Results automatically saved after quiz completion
- Data includes score, topic, date, and time
- Results appear in dashboard immediately
- Storage persists across sessions

## Error Handling

### US-022: Duplicate User ID Error
**As a user**, I want to receive a clear error message when I enter a duplicate user ID so that I can choose a different one.

**Acceptance Criteria:**
- Clear error message explaining the issue
- Suggestion to try a different ID
- Input field remains accessible for retry
- No access granted until unique ID provided

### US-023: Network Connection Error
**As a user**, I want to be notified if there are network issues so that I understand why the application isn't working.

**Acceptance Criteria:**
- Clear error message for connection problems
- Suggestion to check internet connection
- Retry option when connection restored
- Graceful handling without application crash

### US-024: Quiz Session Loss
**As a user**, I want to understand that closing my browser will lose my quiz progress so that I can make informed decisions.

**Acceptance Criteria:**
- Warning message about session loss (if applicable)
- Clear indication that progress isn't saved
- User understands consequences of browser closure
- No false expectations about progress recovery

## Administrative Functions

### US-025: Question Bank Setup
**As an administrator**, I want to create a database script to populate question banks so that users have quiz content available.

**Acceptance Criteria:**
- Script creates questions for all topics (General Knowledge, Science, Films)
- Each topic contains at least 100 questions
- Each question has exactly 4 answers with 1 correct answer
- Script can be executed to populate database
- Questions are text-based only
- Data structure supports random selection

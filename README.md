# Animatica Backend

A robust Express.js backend API for an educational platform focused on teaching Operating System CPU scheduling algorithms with AI-powered assistance and comprehensive analytics.

**Frontend Repository**: [animatica](https://github.com/ziad40/animatica) | **GitHub Profile**: [ziad40](https://github.com/ziad40)


## Diagrams

### Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ ATTEMPT : has
    USER ||--o{ CONVERSATION : has
    QUESTION ||--o{ ATTEMPT : has
    QUESTION ||--o{ CONVERSATION : has

    USER {
      string _id
      string fullName
      string name
      string email
      string password
      string role
    }
    QUESTION {
      string _id
      string type
      mixed question
      mixed solution
      date createdAt
    }
    ATTEMPT {
      string _id
      objectId userId
      objectId question
      mixed trialAnswer
      mixed scoreCal
      number score
      number time
      date createdAt
    }
    CONVERSATION {
      string _id
      objectId userId
      objectId question
      array messages
    }
```

### Class Diagram

```mermaid
classDiagram
    class User {
      +String fullName
      +String name
      +String email
      +String password
      +String role
    }
    class Question {
      +String type
      +Mixed question
      +Mixed solution
      +Date createdAt
    }
    class Attempt {
      +ObjectId userId
      +ObjectId question
      +Mixed trialAnswer
      +Mixed scoreCal
      +Number score
      +Number time
      +Date createdAt
    }
    class Conversation {
      +ObjectId userId
      +ObjectId question
      +Array messages
    }
    User "1" -- "many" Attempt
    User "1" -- "many" Conversation
    Question "1" -- "many" Attempt
    Question "1" -- "many" Conversation
```

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Problem Generation System](#problem-generation-system)
- [Problem Solving & Validation](#problem-solving--validation)
- [Analytics & Analysis](#analytics--analysis)
- [Services & Controllers](#services--controllers)
- [Middleware](#middleware)
- [Error Handling](#error-handling)
- [Dependencies](#dependencies)

## 🎯 Project Overview

Animatica Backend is a comprehensive Node.js/Express API server that powers the educational platform for learning OS scheduling algorithms. The backend handles:

- User authentication and session management
- Dynamic problem generation and validation
- AI-powered hints and assistance
- Student progress tracking and analytics
- Teacher classroom management
- Real-time conversation history
- MongoDB data persistence
- OAuth integration for social login

## ✨ Features

### Core Features

1. **User Authentication & Authorization**
   - JWT-based authentication
   - Password hashing with bcryptjs
   - Role-based access control (Student, Teacher, Admin)
   - Google OAuth 2.0 integration
   - Session management with express-session

2. **Problem Generation & Validation**
   - Dynamic CPU scheduling problems using Factory pattern
   - Support for 5 algorithm types: FCFS, SJF, Priority, Round Robin, SRTF
   - Comprehensive answer validation and scoring
   - Automatic solution verification
   - Attempt history tracking

3. **AI-Powered Assistance**
   - OpenAI GPT integration for intelligent hints
   - Context-aware explanations
   - Conversation history management
   - Learning-focused responses
   - Multi-language support ready

4. **Student Management**
   - Track all student attempts
   - Detailed performance analytics
   - Progress visualization data
   - Question-specific analysis
   - Time tracking and metrics

5. **Teacher Features**
   - View all class students
   - Access detailed student analytics
   - Review individual attempt details
   - Track class-wide statistics
   - Performance comparison tools

6. **Analytics & Reporting**
   - Aggregate class statistics
   - Individual student progress
   - Algorithm-specific performance
   - Time-based metrics
   - Success rate calculations

## 🛠 Tech Stack

### Core Framework & Runtime
- **Node.js** - JavaScript runtime
- **Express 5.1.0** - Web application framework
- **Nodemon** - Development auto-restart utility

### Database & ORM
- **MongoDB** - NoSQL database
- **Mongoose 8.19.1** - MongoDB object modeling

### Authentication & Security
- **JSON Web Tokens (JWT) 9.0.2** - Token-based authentication
- **bcryptjs 3.0.2** - Password hashing
- **Passport 0.7.0** - Authentication middleware
- **Passport Google OAuth 2.0 2.0.0** - Google login strategy
- **Express Session 1.18.2** - Session management
- **CORS 2.8.5** - Cross-Origin Resource Sharing

### AI & LLM Integration
- **OpenAI 6.7.0** - GPT API integration
- **Groq SDK 0.35.0** - Alternative LLM provider support

### Utilities
- **Dotenv 17.2.3** - Environment variable management

## 📁 Project Structure

```
animatica-Express/
├── server.js                # Main application entry point
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables (not committed)
├── config/
│   ├── db.js              # MongoDB connection configuration
│   └── openaiClient.js    # OpenAI client initialization
├── controllers/           # Request handlers
│   ├── authController.js  # Authentication logic
│   ├── botController.js   # AI assistant logic
│   ├── problemController.js # Problem generation & validation
│   ├── studentController.js # Student analytics
│   └── teacherController.js # Teacher features
├── middlewares/
│   └── authMiddleware.js  # JWT verification middleware
├── models/               # MongoDB schemas
│   ├── User.js          # User model (Students, Teachers, Admins)
│   ├── Question.js      # Generated questions/problems
│   ├── Attempt.js       # Student attempts and scores
│   └── Conversation.js  # AI conversation history
├── routes/              # API route definitions
│   ├── auth.js         # Authentication routes
│   ├── problem.js      # Problem management routes
│   ├── botAI.js        # AI assistant routes
│   ├── student.js      # Student analytics routes
│   ├── teacher.js      # Teacher management routes
│   └── users.js        # User management routes
├── service/            # Business logic & utilities
│   ├── QuestionService.js        # Question generation service
│   ├── ResolveQuestion.js        # Question resolution helper
│   └── question/                 # Question type implementations
│       ├── Question.js           # Base question class
│       ├── QuestionFactory.js    # Factory for creating questions
│       ├── FCFSQuestion.js       # FCFS algorithm
│       ├── SJFQuestion.js        # SJF algorithm
│       ├── PriorityQuestion.js   # Priority scheduling
│       ├── RoundRobinQuestion.js # Round Robin algorithm
│       └── SRTFQuestion.js       # SRTF algorithm
└── error/
    └── UnsupportedProblemTypeError.js # Custom error class
```

## 💻 Installation

### Prerequisites
- Node.js 14+ and npm/yarn
- MongoDB server running locally or remote URI
- OpenAI API key
- Google OAuth credentials (optional, for social login)

### Steps

1. **Clone the repository**
   ```bash
   cd animatica-Express
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/animatica
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   AI_MODEL=gpt-4-turbo
   OPENAI_API_KEY=your_openai_api_key_here
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
   SESSION_SECRET=your_session_secret_here
   CORS_ORIGIN=http://localhost:5173
   ```

## 🚀 Getting Started

### Development Server

Start the development server with auto-reload:

```bash
npm run dev
```

The server will run on **`http://0.0.0.0:5000`** (accessible from the LAN on port 5000).

The frontend will connect to the backend at: `http://localhost:5000/api`

### Production Server

Start the production server:

```bash
npm start
```

### Test the API

Once the server is running, you can test endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Get a FCFS problem
curl http://localhost:5000/api/problem?type=fcfs

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## 🔧 Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` or `production` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/animatica` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key_here` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `AI_MODEL` | OpenAI model to use | `gpt-4-turbo` or `gpt-3.5-turbo` |
| `OPENAI_API_KEY` | OpenAI API key | From OpenAI dashboard |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | From Google Console |
| `GOOGLE_CALLBACK_URL` | Google OAuth redirect URL | `http://localhost:5000/api/auth/google/callback` |
| `SESSION_SECRET` | Secret for express-session | `your_session_secret` |
| `CORS_ORIGIN` | Frontend URL for CORS | `http://localhost:5173` |

### Optional Variables

```env
# Groq SDK (alternative LLM)
GROQ_API_KEY=your_groq_api_key

# Additional CORS origins (comma-separated)
ADDITIONAL_CORS_ORIGINS=https://example.com,https://another.com
```

## 📡 API Endpoints

### Authentication Routes `/api/auth`

#### POST /login
Login with email and password
- **Request**: `{ email, password }`
- **Response**: `{ token, user }`
- **Status**: 200, 401, 400

#### POST /register
Register a new user
- **Request**: `{ name, email, password, fullName }`
- **Response**: `{ message, user }`
- **Status**: 201, 400, 409

#### GET /logout
Logout current user
- **Status**: 200

#### GET /google
Initiate Google OAuth login
- Redirects to Google consent screen

#### GET /google/callback
Google OAuth callback endpoint
- Handles OAuth token exchange

### Problem Routes `/api/problem`

#### GET / (requires auth)
Fetch a problem of specific type
- **Query**: `{ type: 'fcfs' | 'sjf' | 'priority' | 'round-robin' | 'srtf' }`
- **Response**: `{ _id, type, question, solution }`
- **Status**: 200, 400, 500

#### POST /solve (requires auth)
Submit and validate problem solution
- **Request**: `{ questionId?, question?, trialAnswer, time }`
- **Response**: `{ score, scoreCal, feedback }`
- **Status**: 200, 400, 500

### AI Assistant Routes `/api/bot`

#### POST /hint (requires auth)
Get AI hint for incorrect answer
- **Request**: `{ type, answer, solution }`
- **Response**: `{ content }` (AI hint text)
- **Status**: 200, 400, 500

#### POST /ask (requires auth)
Ask a question about current problem
- **Request**: `{ message, questionId? | question? }`
- **Response**: `{ content }` (AI response)
- **Status**: 200, 400, 500

#### GET /conversation (requires auth)
Get conversation history
- **Response**: `[ { role, content, timestamp } ]`
- **Status**: 200

### Student Analytics Routes `/api/students`

#### GET / (requires auth)
Get logged-in student's attempt history
- **Response**: `[ { _id, questionType, score, time, createdAt } ]`
- **Status**: 200

#### GET /:username (requires auth, teacher role)
Get specific student's analysis
- **Response**: `{ totalAttempts, totalScore, averageScore, algorithms: { [type]: {} } }`
- **Status**: 200, 404

#### GET /:username/:questionId (requires auth, teacher role)
Get student's analysis for specific question
- **Response**: `{ attempts: [ { trialAnswer, score, time } ], statistics: {} }`
- **Status**: 200, 404

### Teacher Routes `/api/teacher/students`

#### GET / (requires auth, teacher role)
Get all students in teacher's class
- **Response**: `[ { _id, name, email, role, enrollmentDate } ]`
- **Status**: 200

#### GET /statistics (requires auth, teacher role)
Get class-wide statistics
- **Response**: `{ totalStudents, averageScore, totalAttempts, topPerformers: [] }`
- **Status**: 200

### User Routes `/api/users`

#### GET /profile (requires auth)
Get current user's profile
- **Response**: `{ _id, name, email, role, fullName }`
- **Status**: 200

#### PUT /profile (requires auth)
Update user profile
- **Request**: `{ fullName?, email? }`
- **Response**: `{ message, user }`
- **Status**: 200, 400

## 🗄️ Database Models

### User Schema

```javascript
{
  fullName: String,           // User's full name
  name: String,               // Username/display name
  email: String,              // Unique email address
  password: String,           // Hashed password
  role: String,               // 'student' | 'teacher' | 'admin'
  createdAt: Date,            // Account creation timestamp
}
```

### Question Schema

```javascript
{
  type: String,               // 'fcfs' | 'sjf' | 'priority' | 'round-robin' | 'srtf'
  question: Mixed,            // Problem data/parameters
  solution: Mixed,            // Expected solution
  createdAt: Date,            // Question creation timestamp
}
```

### Attempt Schema

```javascript
{
  userId: ObjectId,           // Reference to User
  question: ObjectId,         // Reference to Question
  trialAnswer: Mixed,         // Student's submitted answer
  scoreCal: Mixed,            // Detailed scoring breakdown
  score: Number,              // Final score (0-100)
  time: Number,               // Time taken (seconds)
  createdAt: Date,            // Attempt timestamp
}
```

### Conversation Schema

```javascript
{
  userId: ObjectId,           // Reference to User
  questionId: ObjectId,       // Reference to Question
  messages: [{
    role: String,             // 'user' | 'assistant'
    content: String,          // Message text
    timestamp: Date,          // Message timestamp
  }],
  createdAt: Date,
  updatedAt: Date,
}
```

## 🎲 Problem Generation System

The Animatica backend dynamically generates CPU scheduling problems for students to practice and learn different algorithms.

### How Problems Are Generated

#### 1. **Problem Request Flow**

**User Request** → Frontend calls `GET /api/problem?type=fcfs`  
↓  
**Problem Controller** → `problemController.getQuestion()`  
↓  
**Question Service** → `QuestionService.generateQuestion(type)`  
↓  
**Question Factory** → `QuestionFactory.create(type)` - Creates appropriate algorithm instance  
↓  
**Specific Algorithm Class** → Generates unique problem instance (e.g., FCFSQuestion.generate())  
↓  
**Stored in Database** → Question saved to MongoDB  
↓  
**Sent to Frontend** → JSON response with problem data

#### 2. **Algorithm-Specific Generation**

Each algorithm class extends the base `Question` class and implements its own problem generation logic:

**FCFS (First Come First Served)**
- Generates random number of processes (3-8 typical)
- Each process gets:
  - Unique ID (P1, P2, P3, etc.)
  - Random arrival time (0-5 time units)
  - Random burst time (3-10 time units)
- No special constraints needed

**Example Generated Problem**:
```javascript
{
  type: "fcfs",
  question: {
    processes: [
      { id: "P1", arrivalTime: 0, burstTime: 5 },
      { id: "P2", arrivalTime: 1, burstTime: 3 },
      { id: "P3", arrivalTime: 2, burstTime: 2 }
    ]
  },
  solution: {
    order: ["P1", "P2", "P3"],
    gantt: {
      P1: { start: 0, end: 5 },
      P2: { start: 5, end: 8 },
      P3: { start: 8, end: 10 }
    },
    metrics: {
      P1: { waitTime: 0, turnaroundTime: 5 },
      P2: { waitTime: 4, turnaroundTime: 7 },
      P3: { waitTime: 6, turnaroundTime: 8 }
    },
    averageWaitingTime: 3.33,
    averageTurnaroundTime: 6.67
  }
}
```

**SJF (Shortest Job First)**
- Generates 4-6 processes with varying burst times
- Ensures burst times are clearly different
- Typical burst times: 2, 4, 5, 7, 10
- Pre-calculates optimal ordering by burst time

**Priority Scheduling**
- Generates 4-6 processes
- Each process assigned priority (1-5, lower = higher priority)
- Ensures different priorities for variety
- Solution calculates based on priority values

**Round Robin**
- Generates 4-5 processes with burst times
- Includes time quantum parameter (typically 2-4 units)
- Solution traces execution with time quantum slices
- Tracks context switches

**SRTF (Shortest Remaining Time First)**
- Generates 4-6 processes with varying burst times
- Multiple arrival times (some arrive later)
- Pre-calculates optimal scheduling with preemption
- Tracks context switches and remaining times

#### 3. **Problem Storage**

Generated problems stored in MongoDB with:
```javascript
{
  type: String,        // Algorithm type
  question: Mixed,     // Problem parameters and data
  solution: Mixed,     // Expected solution with metrics
  createdAt: Date      // Generation timestamp
}
```

#### 4. **Generation Parameters**

Random factors make each problem unique:
- Random number of processes
- Variable arrival times for each process
- Variable burst/execution times
- Random priority values (for priority scheduling)
- Time quantum randomization (for Round Robin)

### Generation Algorithms per Type

**Location**: `service/question/` directory with individual algorithm implementations

- `FCFSQuestion.js` - FCFS generation
- `SJFQuestion.js` - SJF generation  
- `PriorityQuestion.js` - Priority scheduling generation
- `RoundRobinQuestion.js` - Round Robin generation
- `SRTFQuestion.js` - SRTF generation

## ✅ Problem Solving & Validation

### How Problems Are Solved & Validated

#### 1. **Solution Submission Flow**

**User Submits Answer** → Frontend sends `POST /api/problem/solve`  
↓  
**Problem Controller** → `problemController.validateSolution()`  
↓  
**Resolve Question Helper** → Retrieves original question from database  
↓  
**Solution Validator** → Compares student answer with correct solution  
↓  
**Score Calculation** → Computes detailed scoring metrics  
↓  
**Attempt Recording** → Saves attempt and score to database  
↓  
**Response to Frontend** → Returns score, feedback, and detailed analysis

#### 2. **Answer Comparison & Validation**

The backend validates student answers by:

**Process Order Verification**:
- Checks if processes are scheduled in correct order
- For FCFS: must match arrival order
- For SJF/SRTF: must be sorted by burst/remaining time
- For Priority: must follow priority values
- For Round Robin: validates round-robin execution pattern

**Timing Calculation Verification**:
- Validates start times for each process
- Checks completion times
- Verifies no gaps in CPU schedule (unless process hasn't arrived)
- Ensures proper context switching

**Metrics Accuracy**:
- Waiting Time: Time from arrival until first execution starts
- Turnaround Time: Time from arrival until completion
- Average metrics calculated correctly

**Example Validation**:
```javascript
// Student submitted answer for FCFS problem
{
  order: ["P1", "P2", "P3"],
  gantt: {
    P1: { start: 0, end: 5 },
    P2: { start: 5, end: 8 },
    P3: { start: 8, end: 10 }
  }
}

// Backend compares against correct solution:
ComparisonResult: {
  orderCorrect: true,
  timingCorrect: true,
  metricsCorrect: true,
  score: 100
}
```

#### 3. **Scoring System**

**Full Scoring breakdown**:
- **30%** - Correct process order
- **40%** - Correct timing (start/end times)
- **30%** - Correct metrics (waiting times, turnaround times)

**Score Calculation**:
```
score = (orderWeight × orderCorrectness + 
         timingWeight × timingCorrectness + 
         metricsWeight × metricsCorrectness) × 100
```

**Score Levels**:
- 90-100: Excellent (all components correct)
- 70-89: Good (minor timing/ordering issues)
- 50-69: Partial (correct concept, calculation errors)
- Below 50: Incorrect (major conceptual issues)

#### 4. **Attempt Recording**

Each attempt saved to database with:
```javascript
{
  userId: ObjectId,          // Student who attempted
  question: ObjectId,        // Problem attempted
  trialAnswer: Mixed,        // Student's submitted answer
  scoreCal: Mixed,           // Detailed scoring breakdown
  score: Number,             // Final score (0-100)
  time: Number,              // Time taken (seconds)
  createdAt: Date            // Attempt timestamp
}
```

#### 5. **Detailed Feedback Generation**

For incorrect answers, backend provides:
- **Error Identification**: Which aspect was wrong (order, timing, metrics)
- **Score Breakdown**: Points lost in each category
- **Comparison Data**: Side-by-side comparison of student vs correct solution
- **Hints Available**: AI can generate contextual hints based on errors

### AI-Powered Hints

**Hint Generation Process**:

User gets hint → Backend calls `POST /api/bot/hint`  
↓  
OpenAI API receives context:
- Algorithm type (FCFS, SJF, etc.)
- Student's incorrect answer
- Correct solution
↓  
GPT generates one targeted hint:
- Points to ONE mistake (if multiple exist)
- Doesn't reveal the answer
- Educational and learning-focused
- Encourages student to think
↓  
Hint sent to frontend and displayed to student

**Example Hint Generation**:
```javascript
// Student struggling with Priority scheduling
{
  type: "priority",
  studentAnswer: { order: ["P4", "P1", "P2", "P3"] },
  correctSolution: { order: ["P1", "P2", "P4", "P3"] }
}

// AI Generated Hint:
"Your first two processes are in the wrong order. 
 Remember to always execute the process with 
 the HIGHEST priority value first!"
```

## 📊 Analytics & Analysis

### How Analysis is Performed

#### 1. **Student Attempt Analysis**

**Data Collection**:
- Aggregate all attempts by a student
- Group by algorithm type
- Track scores, times, and improvements

**Metrics Calculated**:
```javascript
// For each student:
{
  totalAttempts: Number,           // All attempts combined
  totalScore: Number,              // Sum of all scores
  averageScore: Number,            // Mean score
  algorithms: {
    fcfs: {
      attempts: Number,
      averageScore: Number,
      bestScore: Number,
      averageTime: Number
    },
    sjf: { ... },
    priority: { ... },
    roundRobin: { ... },
    srtf: { ... }
  },
  recentProgress: Number,          // Change last 5 attempts
  improvementTrend: "improving|stable|declining"
}
```

**Backend Route**: `GET /api/students/:username`

**Analysis Components**:
1. **Total Statistics**: Aggregate across all problems
2. **Algorithm Breakdown**: Performance by algorithm type
3. **Time Analysis**: Average time per problem type
4. **Trend Analysis**: Recent performance trend
5. **Problem Difficulty**: Which problems are hardest

#### 2. **Question-Specific Analysis**

**Teacher Views**: `GET /api/students/:username/:questionId`

**Data Analyzed**:
- All attempts at this specific question
- Student's various answers
- Score progression
- Time improvements
- Error patterns

**Sample Output**:
```javascript
{
  questionId: "507f1f77bcf86cd799439012",
  algorithmType: "sjf",
  totalAttempts: 3,
  bestScore: 80,
  averageScore: 60,
  attempts: [
    {
      score: 45,
      time: 320,
      timestamp: "2024-02-20T10:30:00Z",
      errors: ["Process order incorrect"]
    },
    {
      score: 55,
      time: 280,
      timestamp: "2024-02-20T14:45:00Z",
      errors: ["Timing calculation wrong"]
    },
    {
      score: 80,
      time: 250,
      timestamp: "2024-02-20T18:20:00Z",
      errors: []
    }
  ],
  improvements: {
    scoreGain: +35,
    timeReduction: -70,
    conceptMastery: "achieving"
  }
}
```

#### 3. **Class-Wide Statistics**

**Teacher Dashboard**: `GET /api/teacher/students/statistics`

**Aggregated Metrics**:
```javascript
{
  totalStudents: Number,
  totalAttempts: Number,
  classAverageScore: Number,
  classAverageTime: Number,
  algorithmDifficulty: {
    fcfs: { avgScore: 85, attempts: 120 },
    sjf: { avgScore: 72, attempts: 110 },
    priority: { avgScore: 68, attempts: 95 },
    roundRobin: { avgScore: 75, attempts: 105 },
    srtf: { avgScore: 62, attempts: 88 }
  },
  topPerformers: [ ... ],
  strugglingStudents: [ ... ],
  classProgress: "advancing|stable|declining"
}
```

**Key Insights**:
- Which algorithms are most difficult for class
- Which algorithms students master quickly
- Identify at-risk students early
- Recognize top performers
- Track overall class improvement

#### 4. **Backend Analysis Components**

**Location**:
- Student Analytics: `controllers/studentController.js`
- Teacher Analytics: `controllers/teacherController.js`

**Core Functions**:

**studentAnalysis.js**:
```javascript
// Calculates individual student performance
- Aggregate attempts
- Calculate averages
- Identify patterns
- Determine improvement trends
- Flag struggling areas
```

**teacherController.js**:
```javascript
// getAllStudentsStatistics()
- Aggregate class data
- Calculate averages
- Identify outliers
- Generate class insights

// getAllStudents()
- List students in class
- Include basic stats
- Sort by performance

// getStudentProgress()
- Track individual improvement
- Identify recent changes
- Predict future performance
```

#### 5. **Analysis Data Flow**

```
Attempt Submitted
    ↓
Attempt Saved (MongoDB)
    ↓
Analytics Engine (Backend)
    ├── Individual Student Analysis
    │   └── Calculate metrics
    ├── Question Analytics
    │   └── Problem-specific stats
    └── Class Wide Analytics
        └── Aggregate insights
    ↓
Student Views Personal Dashboard
    - Individual stats
    - Progress charts
    - Recent attempts
    ↓
Teacher Views Analytics Dashboard
    - Student stats
    - Class performance
    - Algorithm difficulty
    - Trend analysis
```

#### 6. **Performance Insights Provided**

**For Students**:
- Which algorithms they're strong in
- Which need more practice
- Average time improving?
- Score trends
- Problem-by-problem performance

**For Teachers**:
- Class average performance
- Algorithm difficulty ranking
- Students needing intervention
- Success rate by algorithm
- Overall class improvement

#### 7. **Data Persistence**

Analysis data stored permanently:
- All attempts kept in `Attempt` collection
- Analysis recalculated on-demand
- Historical data never deleted
- Allows long-term trend analysis
- Supports comparing performance over time

## 🔧 Services & Controllers

### Question Generation Service

#### QuestionService.js

Manages problem generation and retrieval:

- **generateQuestion(type)** - Creates a new problem of specified algorithm type
- **validateType(type)** - Checks if type is supported
- **getRandomQuestion(type)** - Retrieves random existing question

#### Question Factory Pattern

The `QuestionFactory` creates appropriate question instances:

```javascript
QuestionFactory.create('fcfs')      // Returns FCFSQuestion
QuestionFactory.create('sjf')       // Returns SJFQuestion
QuestionFactory.create('priority')  // Returns PriorityQuestion
QuestionFactory.create('round-robin') // Returns RoundRobinQuestion
QuestionFactory.create('srtf')      // Returns SRTFQuestion
```

### Algorithm Implementations

#### Base Question Class
Abstract base providing:
- Problem generation algorithm
- Solution verification logic
- Scoring mechanism

#### Specific Algorithms

1. **FCFS (First Come First Served)**
   - Simplest scheduling algorithm
   - Processes executed in arrival order
   - No preemption

2. **SJF (Shortest Job First)**
   - Minimizes average waiting time
   - Requires burst time knowledge
   - No preemption

3. **Priority Scheduling**
   - Processes have assigned priorities
   - Higher priority executes first
   - Can be preemptive or non-preemptive

4. **Round Robin**
   - Each process gets time quantum
   - Cyclic execution
   - Fair CPU distribution

5. **SRTF (Shortest Remaining Time First)**
   - Preemptive version of SJF
   - Minimizes waiting time
   - Requires dynamic calculations

### Problem Controller

Handles problem retrieval and validation:

- **getQuestion(req, res)** - Generates new problem
- **validateSolution(req, res)** - Evaluates student answer
- **getQuestionById(req, res)** - Retrieves specific question

### Bot Controller

Manages AI interactions:

- **showHint(req, res)** - Provides contextual hints for wrong answers
- **askAnything(req, res)** - Answers general questions about problems
- **getConversationHistory(req, res)** - Retrieves past conversations

### Student Controller

Provides student analytics:

- **studentAnalysis(req, res)** - Detailed student performance
- **studentQuestionAnalysis(req, res)** - Specific question analysis
- **getStudentAttempts(req, res)** - All attempts by student

### Teacher Controller

Provides teacher management features:

- **getAllStudents(req, res)** - Lists all students
- **getAllStudentsStatistics(req, res)** - Class statistics
- **getStudentProgress(req, res)** - Individual student progress

### Auth Controller

Manages authentication:

- **login(req, res)** - User login with credentials
- **register(req, res)** - New user registration
- **googleAuth(req, res)** - Google OAuth authentication
- **logout(req, res)** - User logout

## 🔒 Middleware

### Auth Middleware

**File**: `middlewares/authMiddleware.js`

Protects routes requiring authentication:

- Verifies JWT token in Authorization header
- Extracts user information from token
- Attaches user to request object
- Returns 401 if token invalid/missing

```javascript
// Usage in routes
router.get('/protected', authMiddleware, controller);
```

Supports:
- Bearer token format: `Authorization: Bearer <token>`
- JWT verification
- Error handling for expired/invalid tokens

## 🚨 Error Handling

### Custom Error Classes

#### UnsupportedProblemTypeError

Thrown when requested problem type doesn't exist:

```javascript
throw new UnsupportedProblemTypeError('invalid-type');
```

Properties:
- `message` - Error description
- `statusCode` - HTTP status code (400)

### Error Response Format

```javascript
{
  error: "Error message",
  statusCode: 400,
  timestamp: "2024-02-20T10:30:00Z"
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (duplicate email) |
| 500 | Server Error |

## 📦 Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | 5.1.0 | Web framework |
| mongoose | 8.19.1 | MongoDB ODM |
| jsonwebtoken | 9.0.2 | JWT creation/verification |
| bcryptjs | 3.0.2 | Password hashing |
| cors | 2.8.5 | Cross-origin requests |
| dotenv | 17.2.3 | Environment variables |
| openai | 6.7.0 | OpenAI API client |
| passport | 0.7.0 | Authentication |
| passport-google-oauth20 | 2.0.0 | Google login |
| express-session | 1.18.2 | Session management |
| groq-sdk | 0.35.0 | Alternative LLM |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| nodemon | Latest | Auto-reload on changes |

## 📊 Database Connection

### MongoDB Setup

1. **Local MongoDB**
   ```env
   MONGODB_URI=mongodb://localhost:27017/animatica
   ```

2. **MongoDB Atlas (Cloud)**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/animatica
   ```

3. **Connection Pool Configuration**
   - Default: 10 connections
   - Configurable in `config/db.js`

## 🔐 Security Features

1. **Password Security**
   - Bcryptjs hashing with salt rounds
   - Never store plain passwords

2. **JWT Authentication**
   - Signed tokens with expiration
   - Configurable token lifetime
   - Secure secret management

3. **CORS Protection**
   - Configurable allowed origins
   - Credentials support
   - Method restrictions

4. **Input Validation**
   - Email format validation
   - Required field checks
   - Type validation

5. **Session Security**
   - Session secret for signing
   - Secure cookie flags
   - Session expiration

## 🚀 Deployment

### Environment Setup for Production

Create `.env.production`:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/animatica-prod
JWT_SECRET=<generate-secure-key>
OPENAI_API_KEY=<production-key>
CORS_ORIGIN=https://animatica.example.com
```

### PM2 Process Manager

```bash
npm install -g pm2
pm2 start server.js --name "animatica"
pm2 save
pm2 startup
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

## 📝 API Documentation

### Request/Response Examples

#### Login Example

**Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "student",
    "email": "student@example.com",
    "role": "student"
  }
}
```

#### Get Problem Example

**Request:**
```bash
GET /api/problem?type=fcfs
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "type": "fcfs",
  "question": {
    "processes": [
      {"id": "P1", "burstTime": 5},
      {"id": "P2", "burstTime": 3}
    ]
  },
  "solution": {
    "schedule": ["P1", "P2"],
    "averageWaitingTime": 2.5
  }
}
```

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

Solution:
- Ensure MongoDB is running: `mongod`
- Verify connection string in `.env`
- Check firewall rules for MongoDB port

### JWT Token Expired

```
Error: jwt expired
```

Solution:
- User needs to login again
- Frontend should refresh token on 401
- Extend JWT_EXPIRE in `.env` if needed

### AI API Key Invalid

```
Error: 401 Unauthorized
```

Solution:
- Verify OpenAI API key in `.env`
- Check key quota and usage limits
- Ensure API key has necessary permissions

## 📞 Support & Contributing

For issues, feature requests, or contributions:

1. Check existing issues on GitHub
2. Create detailed bug reports
3. Follow code style guidelines
4. Submit pull requests with descriptions

## 📄 License

ISC License - See LICENSE file for details

## 👤 Author

**Ziad Abuelkher**
- GitHub: [@ziad40](https://github.com/ziad40)
- Repository: [Animatica Backend](https://github.com/ziad40/animatica-Express)
- Frontend: [Animatica Frontend](https://github.com/ziad40/animatica)

## 🔗 Related Projects

- **Frontend**: [animatica](https://github.com/ziad40/animatica) - React frontend running on port 5173
- **Backend**: [animatica-Express](https://github.com/ziad40/animatica-Express) - Express.js backend running on port 5000

## 📞 Support & Contributing

For issues, feature requests, or contributions:

1. Frontend Issues: [github.com/ziad40/animatica/issues](https://github.com/ziad40/animatica/issues)
2. Backend Issues: [github.com/ziad40/animatica-Express/issues](https://github.com/ziad40/animatica-Express/issues)
3. Create detailed bug reports
4. Follow code style guidelines
5. Submit pull requests with descriptions

## 📈 Performance Optimization

### Database Indexing

Key indices for performance:

```javascript
// User model
db.users.createIndex({ email: 1 })

// Question model
db.questions.createIndex({ type: 1 })

// Attempt model
db.attempts.createIndex({ userId: 1 })
db.attempts.createIndex({ createdAt: -1 })
```

### API Response Caching

Consider implementing Redis for:
- Frequent questions
- Student statistics
- Teacher dashboards

### Load Balancing

For production:
- Use Nginx reverse proxy
- Multiple Node.js instances
- PM2 cluster mode
- Database read replicas

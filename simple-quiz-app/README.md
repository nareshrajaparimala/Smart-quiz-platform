# Quiz Application - Easy Setup Guide

## 🚀 3 Simple Ways to Run the Application

### **Method 1: One-Click Setup (Easiest)**
```bash
# 1. Extract files and navigate
cd simple-quiz-app

# 2. Run the magic script
./setup.sh

# 3. Access the app
# Frontend: http://localhost:3001
# That's it! 🎉
```

### **Method 2: Docker (Recommended)**
```bash
# 1. Start everything with Docker
cd docker
docker-compose up -d

# 2. Access the app
# Application: http://localhost
# Done! 🐳
```

### **Method 3: Manual (3 Commands)**
```bash
# 1. Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# 2. Setup database
cd database && node seed.js

# 3. Start servers (run in 2 terminals)
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev

# Access: http://localhost:3001
```

## 📋 What You Get

- **3 Quiz Topics**: General Knowledge, Science, Films
- **10 Questions Each**: 20-second timer per question
- **User Dashboard**: Performance analytics and history
- **PDF Export**: Download your quiz results
- **Retake Logic**: Up to 3 attempts per topic until you pass (50%+)

## 🎯 Quick Test

1. **Register**: Create account at http://localhost:3001
2. **Take Quiz**: Select topic → Answer 10 questions
3. **View Results**: See score, export PDF, check dashboard
4. **Retake**: Try again to improve your score

## 🔧 Requirements

- **Node.js 18+** (Download: https://nodejs.org)
- **Docker** (Download: https://docker.com) - Optional but recommended

## 🆘 Need Help?

**MongoDB not starting?**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

**Port already in use?**
```bash
pkill -f node
```

**Database empty?**
```bash
cd database && node seed.js
```

---

**🎉 Ready to test your knowledge? Start with Method 1 for the easiest experience!**
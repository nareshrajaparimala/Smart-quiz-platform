const mongoose = require('mongoose');
require('dotenv').config({ path: '../backend/.env' });

const Topic = require('../backend/models/Topic');
const Question = require('../backend/models/Question');

const topics = [
  { name: 'General Knowledge', description: 'Test your general knowledge' },
  { name: 'Science', description: 'Questions about science' },
  { name: 'Films', description: 'Movie trivia' }
];

const questions = [
  { topic: 'General Knowledge', text: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correct: 2 },
  { topic: 'Science', text: 'What is H2O?', options: ['Hydrogen', 'Water', 'Oxygen', 'Helium'], correct: 1 },
  { topic: 'Films', text: 'Who directed Jaws?', options: ['Lucas', 'Spielberg', 'Scorsese', 'Coppola'], correct: 1 }
];

async function seedMinimal() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizapp');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Topic.deleteMany({});
    await Question.deleteMany({});
    console.log('Cleared existing data');

    // Create topics
    const createdTopics = {};
    for (const topicData of topics) {
      const topic = await Topic.create(topicData);
      createdTopics[topic.name] = topic._id;
      console.log(`Created topic: ${topic.name}`);
    }

    // Create questions
    for (const q of questions) {
      await Question.create({
        topicId: createdTopics[q.topic],
        questionText: q.text,
        options: q.options,
        correctAnswerIndex: q.correct
      });
      console.log(`Created question: ${q.text}`);
    }

    console.log('✅ Minimal seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedMinimal();
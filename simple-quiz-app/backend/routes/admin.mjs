import express from 'express';
import Topic from '../models/Topic.mjs';
import Question from '../models/Question.mjs';

const router = express.Router();

// Seed database endpoint
router.post('/seed', async (req, res) => {
  try {
    // Clear existing data
    await Topic.deleteMany({});
    await Question.deleteMany({});
    
    // Create topics
    const topics = await Topic.create([
      { name: 'General Knowledge', description: 'Test your general knowledge' },
      { name: 'Science', description: 'Questions about science' },
      { name: 'Films', description: 'Movie trivia' }
    ]);
    
    // Create questions
    const questions = [
      { topic: 'General Knowledge', text: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correct: 2 },
      { topic: 'General Knowledge', text: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correct: 1 },
      { topic: 'Science', text: 'What is H2O?', options: ['Hydrogen', 'Water', 'Oxygen', 'Helium'], correct: 1 },
      { topic: 'Science', text: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correct: 2 },
      { topic: 'Films', text: 'Who directed Jaws?', options: ['Lucas', 'Spielberg', 'Scorsese', 'Coppola'], correct: 1 },
      { topic: 'Films', text: 'Which movie won Best Picture in 1994?', options: ['Forrest Gump', 'The Lion King', 'Pulp Fiction', 'Shawshank Redemption'], correct: 0 }
    ];
    
    const topicMap = {};
    topics.forEach(t => topicMap[t.name] = t._id);
    
    for (const q of questions) {
      await Question.create({
        topicId: topicMap[q.topic],
        questionText: q.text,
        options: q.options,
        correctAnswerIndex: q.correct
      });
    }
    
    // Update question counts
    for (const topic of topics) {
      const count = await Question.countDocuments({ topicId: topic._id });
      await Topic.findByIdAndUpdate(topic._id, { questionCount: count });
    }
    
    res.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
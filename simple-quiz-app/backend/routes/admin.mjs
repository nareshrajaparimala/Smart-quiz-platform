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
      // General Knowledge - 10 questions
      { topic: 'General Knowledge', text: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correct: 2 },
      { topic: 'General Knowledge', text: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correct: 1 },
      { topic: 'General Knowledge', text: 'What is the largest ocean?', options: ['Atlantic', 'Pacific', 'Indian', 'Arctic'], correct: 1 },
      { topic: 'General Knowledge', text: 'Who wrote Romeo and Juliet?', options: ['Dickens', 'Shakespeare', 'Austen', 'Wilde'], correct: 1 },
      { topic: 'General Knowledge', text: 'What is the smallest country?', options: ['Monaco', 'Vatican City', 'Malta', 'San Marino'], correct: 1 },
      { topic: 'General Knowledge', text: 'Which continent is Egypt in?', options: ['Asia', 'Europe', 'Africa', 'Australia'], correct: 2 },
      { topic: 'General Knowledge', text: 'What year did World War II end?', options: ['1944', '1945', '1946', '1947'], correct: 1 },
      { topic: 'General Knowledge', text: 'What is the currency of Japan?', options: ['Yuan', 'Won', 'Yen', 'Rupee'], correct: 2 },
      { topic: 'General Knowledge', text: 'Which mountain range contains Everest?', options: ['Andes', 'Alps', 'Rockies', 'Himalayas'], correct: 3 },
      { topic: 'General Knowledge', text: 'What is the longest river in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correct: 1 },
      
      // Science - 10 questions
      { topic: 'Science', text: 'What is H2O?', options: ['Hydrogen', 'Water', 'Oxygen', 'Helium'], correct: 1 },
      { topic: 'Science', text: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correct: 2 },
      { topic: 'Science', text: 'How many bones are in the human body?', options: ['196', '206', '216', '226'], correct: 1 },
      { topic: 'Science', text: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correct: 2 },
      { topic: 'Science', text: 'What is the speed of light?', options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'], correct: 0 },
      { topic: 'Science', text: 'What is the hardest natural substance?', options: ['Gold', 'Iron', 'Diamond', 'Platinum'], correct: 2 },
      { topic: 'Science', text: 'How many chambers does a human heart have?', options: ['2', '3', '4', '5'], correct: 2 },
      { topic: 'Science', text: 'What is the chemical symbol for sodium?', options: ['So', 'Sd', 'Na', 'S'], correct: 2 },
      { topic: 'Science', text: 'What type of animal is a whale?', options: ['Fish', 'Mammal', 'Reptile', 'Amphibian'], correct: 1 },
      { topic: 'Science', text: 'What planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correct: 2 },
      
      // Films - 10 questions
      { topic: 'Films', text: 'Who directed Jaws?', options: ['Lucas', 'Spielberg', 'Scorsese', 'Coppola'], correct: 1 },
      { topic: 'Films', text: 'Which movie won Best Picture in 1994?', options: ['Forrest Gump', 'The Lion King', 'Pulp Fiction', 'Shawshank Redemption'], correct: 0 },
      { topic: 'Films', text: 'Who played Jack in Titanic?', options: ['Brad Pitt', 'Leonardo DiCaprio', 'Tom Cruise', 'Matt Damon'], correct: 1 },
      { topic: 'Films', text: 'What is the highest-grossing film of all time?', options: ['Titanic', 'Avatar', 'Avengers Endgame', 'Star Wars'], correct: 2 },
      { topic: 'Films', text: 'Who directed The Godfather?', options: ['Scorsese', 'Coppola', 'Spielberg', 'Lucas'], correct: 1 },
      { topic: 'Films', text: 'Which film features the quote "May the Force be with you"?', options: ['Star Trek', 'Star Wars', 'Guardians of Galaxy', 'Interstellar'], correct: 1 },
      { topic: 'Films', text: 'Who played the Joker in The Dark Knight?', options: ['Jack Nicholson', 'Joaquin Phoenix', 'Heath Ledger', 'Jared Leto'], correct: 2 },
      { topic: 'Films', text: 'What year was the first Harry Potter movie released?', options: ['2000', '2001', '2002', '2003'], correct: 1 },
      { topic: 'Films', text: 'Who directed Pulp Fiction?', options: ['Scorsese', 'Tarantino', 'Coppola', 'Nolan'], correct: 1 },
      { topic: 'Films', text: 'Which movie features the song "My Heart Will Go On"?', options: ['Ghost', 'Titanic', 'The Bodyguard', 'Dirty Dancing'], correct: 1 }
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
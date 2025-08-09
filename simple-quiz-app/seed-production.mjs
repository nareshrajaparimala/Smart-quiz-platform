import mongoose from 'mongoose';

// Connect to your production MongoDB
await mongoose.connect('mongodb+srv://quizuser:quizpass123@cluster0.dt63zvk.mongodb.net/quizapp?retryWrites=true&w=majority');

// Define schemas
const topicSchema = new mongoose.Schema({
  name: String,
  description: String,
  isActive: { type: Boolean, default: true },
  questionCount: { type: Number, default: 0 }
});

const questionSchema = new mongoose.Schema({
  topicId: mongoose.Schema.Types.ObjectId,
  questionText: String,
  options: [String],
  correctAnswerIndex: Number,
  isActive: { type: Boolean, default: true }
});

const Topic = mongoose.model('Topic', topicSchema);
const Question = mongoose.model('Question', questionSchema);

// Sample data
const topics = [
  { name: 'General Knowledge', description: 'Test your general knowledge' },
  { name: 'Science', description: 'Questions about science' },
  { name: 'Films', description: 'Movie trivia' }
];

const questions = [
  { topic: 'General Knowledge', text: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correct: 2 },
  { topic: 'General Knowledge', text: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correct: 1 },
  { topic: 'Science', text: 'What is H2O?', options: ['Hydrogen', 'Water', 'Oxygen', 'Helium'], correct: 1 },
  { topic: 'Science', text: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correct: 2 },
  { topic: 'Films', text: 'Who directed Jaws?', options: ['Lucas', 'Spielberg', 'Scorsese', 'Coppola'], correct: 1 },
  { topic: 'Films', text: 'Which movie won Best Picture in 1994?', options: ['Forrest Gump', 'The Lion King', 'Pulp Fiction', 'Shawshank Redemption'], correct: 0 }
];

try {
  // Clear existing data
  await Topic.deleteMany({});
  await Question.deleteMany({});
  
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
  
  // Update topic question counts
  for (const [topicName, topicId] of Object.entries(createdTopics)) {
    const count = await Question.countDocuments({ topicId });
    await Topic.findByIdAndUpdate(topicId, { questionCount: count });
  }
  
  console.log('✅ Database seeded successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
}
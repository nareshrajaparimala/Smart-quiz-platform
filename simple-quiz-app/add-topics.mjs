import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb+srv://quizuser:quizpass123@cluster0.dt63zvk.mongodb.net/quizapp?retryWrites=true&w=majority');

try {
  await client.connect();
  const db = client.db('quizapp');
  
  // Clear existing data
  await db.collection('topics').deleteMany({});
  await db.collection('questions').deleteMany({});
  
  // Insert topics
  const topics = await db.collection('topics').insertMany([
    { name: 'General Knowledge', description: 'Test your general knowledge', isActive: true, questionCount: 2 },
    { name: 'Science', description: 'Questions about science', isActive: true, questionCount: 2 },
    { name: 'Films', description: 'Movie trivia', isActive: true, questionCount: 2 }
  ]);
  
  console.log('Topics created:', topics.insertedCount);
  
  // Get topic IDs
  const topicDocs = await db.collection('topics').find({}).toArray();
  const topicMap = {};
  topicDocs.forEach(t => topicMap[t.name] = t._id);
  
  // Insert questions
  const questions = await db.collection('questions').insertMany([
    { topicId: topicMap['General Knowledge'], questionText: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correctAnswerIndex: 2, isActive: true },
    { topicId: topicMap['General Knowledge'], questionText: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctAnswerIndex: 1, isActive: true },
    { topicId: topicMap['Science'], questionText: 'What is H2O?', options: ['Hydrogen', 'Water', 'Oxygen', 'Helium'], correctAnswerIndex: 1, isActive: true },
    { topicId: topicMap['Science'], questionText: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctAnswerIndex: 2, isActive: true },
    { topicId: topicMap['Films'], questionText: 'Who directed Jaws?', options: ['Lucas', 'Spielberg', 'Scorsese', 'Coppola'], correctAnswerIndex: 1, isActive: true },
    { topicId: topicMap['Films'], questionText: 'Which movie won Best Picture in 1994?', options: ['Forrest Gump', 'The Lion King', 'Pulp Fiction', 'Shawshank Redemption'], correctAnswerIndex: 0, isActive: true }
  ]);
  
  console.log('Questions created:', questions.insertedCount);
  console.log('✅ Database seeded successfully!');
  
} catch (error) {
  console.error('❌ Error:', error);
} finally {
  await client.close();
}
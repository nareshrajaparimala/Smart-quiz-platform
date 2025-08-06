const { MongoClient } = require('mongodb');

async function seedDirect() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('quizapp');
    
    // Clear collections
    await db.collection('topics').deleteMany({});
    await db.collection('questions').deleteMany({});
    console.log('Cleared existing data');
    
    // Insert topics
    const topics = await db.collection('topics').insertMany([
      { name: 'General Knowledge', description: 'Test your general knowledge', isActive: true, questionCount: 10 },
      { name: 'Science', description: 'Questions about science', isActive: true, questionCount: 10 },
      { name: 'Films', description: 'Movie trivia', isActive: true, questionCount: 10 }
    ]);
    console.log('Created topics');
    
    // Insert questions
    const topicIds = Object.values(topics.insertedIds);
    
    const allQuestions = [
      // General Knowledge
      { topicId: topicIds[0], questionText: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correctAnswerIndex: 2, isActive: true },
      { topicId: topicIds[0], questionText: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctAnswerIndex: 1, isActive: true },
      { topicId: topicIds[0], questionText: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctAnswerIndex: 3, isActive: true },
      { topicId: topicIds[0], questionText: 'Who painted the Mona Lisa?', options: ['Van Gogh', 'Da Vinci', 'Picasso', 'Michelangelo'], correctAnswerIndex: 1, isActive: true },
      { topicId: topicIds[0], questionText: 'What is the smallest country in the world?', options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], correctAnswerIndex: 1, isActive: true },
      { topicId: topicIds[0], questionText: 'Which continent is the largest?', options: ['Africa', 'Asia', 'North America', 'Europe'], correctAnswerIndex: 1, isActive: true },
      { topicId: topicIds[0], questionText: 'What is the longest river in the world?', options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'], correctAnswerIndex: 1, isActive: true },
      { topicId: topicIds[0], questionText: 'How many continents are there?', options: ['5', '6', '7', '8'], correctAnswerIndex: 2, isActive: true },
      { topicId: topicIds[0], questionText: 'What is the currency of Japan?', options: ['Yuan', 'Won', 'Yen', 'Rupee'], correctAnswerIndex: 2, isActive: true },
      { topicId: topicIds[0], questionText: 'Which mountain range contains Mount Everest?', options: ['Andes', 'Himalayas', 'Alps', 'Rockies'], correctAnswerIndex: 1, isActive: true },
      
      // Science
      { topicId: topicIds[1], questionText: 'What is H2O?', options: ['Hydrogen', 'Water', 'Oxygen', 'Helium'], correctAnswerIndex: 1, isActive: true },
      { topicId: topicIds[1], questionText: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctAnswerIndex: 2, isActive: true },
      { topicId: topicIds[1], questionText: 'How many bones are in the adult human body?', options: ['206', '208', '210', '212'], correctAnswerIndex: 0, isActive: true },
      { topicId: topicIds[1], questionText: 'What is the speed of light?', options: ['299,792,458 m/s', '300,000,000 m/s', '299,000,000 m/s', '298,792,458 m/s'], correctAnswerIndex: 0, isActive: true },
      { topicId: topicIds[1], questionText: 'Which gas makes up 78% of Earth\'s atmosphere?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'], correctAnswerIndex: 2, isActive: true },
      { topicId: topicIds[1], questionText: 'What is the hardest natural substance?', options: ['Gold', 'Iron', 'Diamond', 'Platinum'], correctAnswerIndex: 2, isActive: true },
      { topicId: topicIds[1], questionText: 'How many chambers does a human heart have?', options: ['2', '3', '4', '5'], correctAnswerIndex: 2, isActive: true },
      { topicId: topicIds[1], questionText: 'What is the smallest unit of matter?', options: ['Molecule', 'Atom', 'Electron', 'Proton'], correctAnswerIndex: 1, isActive: true },
      { topicId: topicIds[1], questionText: 'What planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correctAnswerIndex: 2, isActive: true },
      { topicId: topicIds[1], questionText: 'What is the chemical formula for salt?', options: ['NaCl', 'H2SO4', 'CO2', 'CaCO3'], correctAnswerIndex: 0, isActive: true },
      
      // Films
      { topicId: topicIds[2], questionText: 'Who directed Jaws?', options: ['Lucas', 'Spielberg', 'Scorsese', 'Coppola'], correctAnswerIndex: 1, isActive: true },
      { topicId: topicIds[2], questionText: 'Which movie won Best Picture in 1994?', options: ['Forrest Gump', 'Lion King', 'Pulp Fiction', 'Shawshank Redemption'], correctAnswerIndex: 0, isActive: true },
      { topicId: topicIds[2], questionText: 'Who said "Life is like a box of chocolates"?', options: ['Tom Hanks', 'Robin Williams', 'Will Smith', 'Jim Carrey'], correctAnswerIndex: 0, isActive: true },
      { topicId: topicIds[2], questionText: 'What is the highest-grossing film of all time?', options: ['Titanic', 'Avatar', 'Avengers Endgame', 'Star Wars'], correctAnswerIndex: 1, isActive: true },
      { topicId: topicIds[2], questionText: 'Who played Jack Sparrow?', options: ['Orlando Bloom', 'Johnny Depp', 'Geoffrey Rush', 'Keira Knightley'], correctAnswerIndex: 1, isActive: true },
      { topicId: topicIds[2], questionText: 'Which film features the quote "May the Force be with you"?', options: ['Star Trek', 'Star Wars', 'Guardians of Galaxy', 'Interstellar'], correctAnswerIndex: 1, isActive: true },
      { topicId: topicIds[2], questionText: 'Who directed The Godfather?', options: ['Scorsese', 'Coppola', 'Spielberg', 'Lucas'], correctAnswerIndex: 1, isActive: true },
      { topicId: topicIds[2], questionText: 'Which movie features the song "My Heart Will Go On"?', options: ['Ghost', 'Titanic', 'The Bodyguard', 'Dirty Dancing'], correctAnswerIndex: 1, isActive: true },
      { topicId: topicIds[2], questionText: 'Who played the Joker in The Dark Knight?', options: ['Jack Nicholson', 'Heath Ledger', 'Joaquin Phoenix', 'Jared Leto'], correctAnswerIndex: 1, isActive: true },
      { topicId: topicIds[2], questionText: 'Which animated movie features the song "Let It Go"?', options: ['Moana', 'Frozen', 'Tangled', 'Brave'], correctAnswerIndex: 1, isActive: true }
    ];
    
    await db.collection('questions').insertMany(allQuestions);
    console.log('Created questions');
    
    console.log('✅ Direct seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await client.close();
  }
}

seedDirect();
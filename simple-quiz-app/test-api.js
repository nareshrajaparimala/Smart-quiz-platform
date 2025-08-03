const { MongoClient } = require('mongodb');

async function testQuizAPI() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('quizapp');
    
    // Get topics
    const topics = await db.collection('topics').find({}).toArray();
    console.log('📋 Topics:', topics.map(t => ({ id: t._id, name: t.name })));
    
    if (topics.length > 0) {
      const topicId = topics[0]._id;
      console.log(`\n🔍 Testing with topic: ${topics[0].name} (${topicId})`);
      
      // Get questions for this topic
      const questions = await db.collection('questions').find({ topicId }).toArray();
      console.log(`📝 Found ${questions.length} questions for this topic`);
      
      if (questions.length > 0) {
        console.log('✅ Quiz should work - questions are available');
        console.log('Sample question:', questions[0].questionText);
      } else {
        console.log('❌ No questions found for this topic');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await client.close();
  }
}

testQuizAPI();
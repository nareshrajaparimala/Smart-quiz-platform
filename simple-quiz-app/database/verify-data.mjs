const { MongoClient } = require('mongodb');

async function verifyData() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('quizapp');
    
    const topicCount = await db.collection('topics').countDocuments();
    const questionCount = await db.collection('questions').countDocuments();
    
    console.log(`📊 Database Status:`);
    console.log(`   Topics: ${topicCount}`);
    console.log(`   Questions: ${questionCount}`);
    
    const topics = await db.collection('topics').find({}).toArray();
    for (const topic of topics) {
      const count = await db.collection('questions').countDocuments({ topicId: topic._id });
      console.log(`   ${topic.name}: ${count} questions`);
    }
    
    console.log('✅ Database verification complete!');
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  } finally {
    await client.close();
  }
}

verifyData();
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function fetchVotes() {
  try {
    await client.connect();
    const database = client.db('Vote');
    const collection = database.collection('nobulaVote');
    
    const votes = await collection.find().toArray();
    console.log('Votes:', votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
  } finally {
    await client.close();
  }
}

fetchVotes();

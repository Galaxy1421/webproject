const { MongoClient } = require('mongodb');
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const uri = 'mongodb://localhost:27017/Vote'; 
const client = new MongoClient(uri);

let database, collection;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files from the current directory
app.use(express.static(__dirname));

client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
    database = client.db('Vote'); // Database name
    collection = database.collection('nobulaVote'); // Collection name
    startServer();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

function startServer() {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Nebula.html'));
  });

  app.post('/submit-vote', async (req, res) => {
    const selectedNebula = req.body.nebula;
    if (!selectedNebula) {
      return res.status(400).send('Nebula is required');
    }

    try {
      const result = await collection.updateOne(
        { _id: selectedNebula },
        { $inc: { count: 1 } },
        { upsert: true }
      );
      console.log('Vote added for', selectedNebula, 'Result:', result.upsertedCount ? 'Inserted' : 'Updated');
      res.redirect('/');
    } catch (error) {
      console.error('Error submitting vote:', error);
      res.status(500).send('Internal server error');
    }
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

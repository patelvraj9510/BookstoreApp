require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.DB_NAME || "bookstore";
const port = process.env.PORT || 3000;

let db;

MongoClient.connect(uri)
  .then(client => {
    db = client.db(dbName);
    console.log("Connected to MongoDB!");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => console.error("Could not connect to MongoDB:", err));

// 1. GET - Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await db.collection('books').find().toArray();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET/ID - Get a book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await db.collection('books').findOne({ _id: new ObjectId(req.params.id) });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. POST - Create a new book
app.post('/api/books', async (req, res) => {
  try {
    const newBook = req.body;
    const result = await db.collection('books').insertOne(newBook);
    res.status(201).json({ message: "Book created", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. PUT - Update a book
app.put('/api/books/:id', async (req, res) => {
  try {
    const updatedData = req.body;
    const result = await db.collection('books').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedData }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. DELETE - Delete a book
app.delete('/api/books/:id', async (req, res) => {
  try {
    const result = await db.collection('books').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

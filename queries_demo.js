require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.DB_NAME || "bookstore";

async function runDemo() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("Connected to MongoDB for Demo!");
    const db = client.db(dbName);
    const books = db.collection('books');
    const members = db.collection('members');
    const authors = db.collection('authors');
    const customers = db.collection('customers');
    const orders = db.collection('orders');

    // Clean up before demo
    await books.deleteMany({});
    await members.deleteMany({});
    await authors.deleteMany({});
    await customers.deleteMany({});
    await orders.deleteMany({});

    // --- 1. Indexing ---
    console.log("\n--- 1. Indexing ---");
    // Create an index on price and a text index on title and description
    await books.createIndex({ price: 1 });
    await books.createIndex({ title: "text", description: "text" });
    console.log("Created Indexes: price (Ascending) and text index on title/description");

    // --- 2. InsertOne ---
    console.log("\n--- 2. InsertOne ---");
    const book1 = {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 15.99,
      genres: ["Classic", "Fiction"],
      description: "A novel about the American Dream.",
      stock: 10,
      publishedYear: 1925
    };
    const insertOneResult = await books.insertOne(book1);
    console.log(`Inserted one book with ID: ${insertOneResult.insertedId}`);

    // --- 3. InsertMany ---
    console.log("\n--- 3. InsertMany ---");
    const initialBooks = [];
    for(let i = 2; i <= 35; i++) {
      initialBooks.push({
        title: `Book Title ${i}`,
        author: `Author ${i}`,
        price: Math.round((10 + Math.random() * 20) * 100) / 100,
        genres: i % 2 === 0 ? ["Fiction", "Mystery"] : ["Non-Fiction", "History"],
        description: `This is the description for Book ${i}. It is a great read!`,
        stock: Math.floor(Math.random() * 20),
        publishedYear: 1990 + Math.floor(Math.random() * 30)
      });
    }
    const insertManyResult = await books.insertMany(initialBooks);
    console.log(`Inserted ${insertManyResult.insertedCount} books`);

    // --- 3b. Insert Authors, Customers, Orders ---
    console.log("\n--- 3b. Insert Authors, Customers, Orders (10 each) ---");
    const authorDocs = Array.from({ length: 10 }, (_, i) => ({
      name: `Author ${i + 1}`,
      country: i % 2 === 0 ? "USA" : "UK",
      birthYear: 1950 + i
    }));
    await authors.insertMany(authorDocs);
    console.log(`Inserted 10 authors`);

    const customerDocs = Array.from({ length: 10 }, (_, i) => ({
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      loyaltyPoints: Math.floor(Math.random() * 100)
    }));
    const custInsertRes = await customers.insertMany(customerDocs);
    console.log(`Inserted 10 customers`);

    const orderDocs = Array.from({ length: 10 }, (_, i) => ({
      orderId: `ORD-${1000 + i}`,
      customerId: custInsertRes.insertedIds[i],
      totalAmount: Math.round((20 + Math.random() * 50) * 100) / 100,
      orderDate: new Date()
    }));
    await orders.insertMany(orderDocs);
    console.log(`Inserted 10 orders`);

    // --- 4. Find ---
    console.log("\n--- 4. Find ---");
    const allFiction = await books.find({ genres: "Fiction" }).limit(3).toArray();
    console.log(`Found ${allFiction.length} Fiction books (limited to 3):`, allFiction.map(b => b.title));

    // --- 5. Sorting ---
    console.log("\n--- 5. Sorting ---");
    const sortedBooks = await books.find().sort({ price: -1 }).limit(3).toArray();
    console.log("Top 3 most expensive books:", sortedBooks.map(b => `${b.title} ($${b.price})`));

    // --- 6. UpdateOne ---
    console.log("\n--- 6. UpdateOne ---");
    const updateOneResult = await books.updateOne(
      { title: "The Great Gatsby" },
      { $set: { price: 12.99, stock: 15 } }
    );
    console.log(`UpdateOne matched: ${updateOneResult.matchedCount}, modified: ${updateOneResult.modifiedCount}`);

    // --- 7. UpdateMany ---
    console.log("\n--- 7. UpdateMany ---");
    // Increase price by 10% for all books published before 2000
    const updateManyResult = await books.updateMany(
      { publishedYear: { $lt: 2000 } },
      { $mul: { price: 1.1 } }
    );
    console.log(`UpdateMany matched: ${updateManyResult.matchedCount}, modified: ${updateManyResult.modifiedCount}`);

    // --- 8. Regex Query ---
    console.log("\n--- 8. Regex Query ---");
    const regexBooks = await books.find({ author: { $regex: /^Author 1/ } }).limit(3).toArray();
    console.log(`Found books with author starting with 'Author 1':`, regexBooks.map(b => b.author));

    // --- 9. Text Search ---
    console.log("\n--- 9. Text Search ---");
    // Text search requires a text index, which we created earlier
    const textSearchResults = await books.find({ $text: { $search: "great read" } }).limit(2).toArray();
    console.log("Text search results for 'great read':", textSearchResults.map(b => b.title));

    // --- 10. Aggregation ---
    console.log("\n--- 10. Aggregation ---");
    // Group books by genre and calculate average price
    const pipeline = [
      { $unwind: "$genres" },
      { $group: { _id: "$genres", avgPrice: { $avg: "$price" }, count: { $sum: 1 } } }
    ];
    const aggResult = await books.aggregate(pipeline).toArray();
    console.log("Aggregation Result (Average Price by Genre):", aggResult);

    // --- 11. Transaction Query ---
    console.log("\n--- 11. Transaction Query ---");
    // Note: Transactions require MongoDB Replica Set. 
    // This try-catch handles standalone server errors gracefully.
    const session = client.startSession();
    try {
      session.startTransaction();
      // Step 1: Member borrows a book
      const member = { name: "Alice", borrowedBooks: [] };
      const memberResult = await members.insertOne(member, { session });
      
      // Step 2: Decrease stock of a book
      const bookToBorrow = await books.findOne({}, { session });
      await books.updateOne({ _id: bookToBorrow._id }, { $inc: { stock: -1 } }, { session });
      
      // Step 3: Add book to member's borrowed list
      await members.updateOne(
        { _id: memberResult.insertedId }, 
        { $push: { borrowedBooks: bookToBorrow._id } }, 
        { session }
      );
      
      await session.commitTransaction();
      console.log("Transaction successfully committed! (Stock decreased and member updated)");
    } catch (err) {
      await session.abortTransaction();
      console.log("Transaction aborted. Note: Transactions require a Replica Set. If you are running a standalone MongoDB, transactions will fail. Error:", err.message);
    } finally {
      session.endSession();
    }

    // --- 12. DeleteOne ---
    console.log("\n--- 12. DeleteOne ---");
    const deleteOneResult = await books.deleteOne({ title: "Book Title 2" });
    console.log(`DeleteOne deleted count: ${deleteOneResult.deletedCount}`);

    // --- 13. DeleteMany ---
    console.log("\n--- 13. DeleteMany ---");
    // Delete books with stock less than 5
    const deleteManyResult = await books.deleteMany({ stock: { $lt: 5 } });
    console.log(`DeleteMany deleted count: ${deleteManyResult.deletedCount}`);

  } finally {
    await client.close();
    console.log("\nDemo completed. Connection closed.");
  }
}

runDemo().catch(console.dir);

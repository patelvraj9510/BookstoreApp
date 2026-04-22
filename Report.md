# MongoDB Queries Report: Bookstore System

## 1. Indexing
- **Query:** `db.collection('books').createIndex({ title: "text", description: "text" })`
- **Why it's used:** To enable text search capabilities on the `title` and `description` fields, allowing efficient string matching.
- **Expected output:** The index is successfully created, returning the index name (e.g., `title_text_description_text`).

## 2. InsertOne
- **Query:** `db.collection('books').insertOne({ title: "The Great Gatsby", ... })`
- **Why it's used:** To insert a single new book document into the `books` collection.
- **Expected output:** An object containing `acknowledged: true` and the `insertedId` of the new document.

## 3. InsertMany
- **Query:** `db.collection('books').insertMany([{...}, {...}, ...])`
- **Why it's used:** To bulk insert multiple book documents efficiently in a single operation, initializing the database with the required 35 records.
- **Expected output:** An object containing `acknowledged: true`, `insertedCount` (34), and an object `insertedIds` mapping indexes to the newly generated ObjectIds.

## 4. Find
- **Query:** `db.collection('books').find({ genres: "Fiction" }).limit(3)`
- **Why it's used:** To retrieve all books that include "Fiction" in their genres array.
- **Expected output:** A cursor containing an array of book documents that match the genre "Fiction", limited to a maximum of 3 documents.

## 5. Sorting
- **Query:** `db.collection('books').find().sort({ price: -1 }).limit(3)`
- **Why it's used:** To order the results based on the `price` field in descending order (-1), finding the top 3 most expensive books.
- **Expected output:** An array of the 3 most expensive book documents, sorted from highest price to lowest price.

## 6. UpdateOne
- **Query:** `db.collection('books').updateOne({ title: "The Great Gatsby" }, { $set: { price: 12.99, stock: 15 } })`
- **Why it's used:** To update specific fields (`price` and `stock`) of a single document that matches the given title filter.
- **Expected output:** An object showing `matchedCount: 1` and `modifiedCount: 1`.

## 7. UpdateMany
- **Query:** `db.collection('books').updateMany({ publishedYear: { $lt: 2000 } }, { $mul: { price: 1.1 } })`
- **Why it's used:** To apply a 10% price increase to all books published before the year 2000 in a single operation.
- **Expected output:** An object showing `matchedCount` (number of books published before 2000) and `modifiedCount` (number of books whose prices were successfully updated).

## 8. Regex Query
- **Query:** `db.collection('books').find({ author: { $regex: /^Author 1/ } })`
- **Why it's used:** To perform pattern matching, finding all books where the author's name starts with "Author 1" (e.g., Author 1, Author 10, Author 11).
- **Expected output:** An array of book documents where the `author` string matches the regular expression pattern.

## 9. Text Search
- **Query:** `db.collection('books').find({ $text: { $search: "great read" } })`
- **Why it's used:** To utilize the text index to search for specific words or phrases within the indexed string fields (`title` and `description`).
- **Expected output:** An array of book documents that contain the words "great" or "read" in their title or description.

## 10. Aggregation
- **Query:** `db.collection('books').aggregate([{ $unwind: "$genres" }, { $group: { _id: "$genres", avgPrice: { $avg: "$price" }, count: { $sum: 1 } } }])`
- **Why it's used:** To perform complex data processing. This pipeline unwinds the `genres` array to create a document per genre per book, then groups them by genre to calculate the average price and count of books per genre.
- **Expected output:** An array of documents representing each genre, containing the genre name (`_id`), the `avgPrice`, and the `count` of books.

## 11. Transaction Query
- **Query:** `session.startTransaction(); await members.insertOne(..., { session }); await books.updateOne(..., { session }); await members.updateOne(..., { session }); await session.commitTransaction();`
- **Why it's used:** To execute multiple operations securely in an all-or-nothing manner. This ensures that if the member insertion or stock update fails, all changes are rolled back, preventing data inconsistency.
- **Expected output:** The transaction successfully commits the changes to both the `members` and `books` collections simultaneously. Note: Transactions require a MongoDB Replica Set configuration.

## 12. DeleteOne
- **Query:** `db.collection('books').deleteOne({ title: "Book Title 2" })`
- **Why it's used:** To remove a single document from the collection that matches the provided filter.
- **Expected output:** An object containing `acknowledged: true` and `deletedCount: 1`.

## 13. DeleteMany
- **Query:** `db.collection('books').deleteMany({ stock: { $lt: 5 } })`
- **Why it's used:** To delete multiple documents simultaneously that meet a specific condition, such as removing all books with a stock of less than 5.
- **Expected output:** An object containing `acknowledged: true` and `deletedCount` representing the total number of documents removed.

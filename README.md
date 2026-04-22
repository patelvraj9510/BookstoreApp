# Bookstore Database System

A simple bookstore database system demonstrating the use of MongoDB with a Node.js backend. This project covers all 15 required MongoDB queries and implements an Express API.

## Requirements

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)

## Setup Instructions

1. **Install Dependencies**
   Navigate to the project folder and run:
   ```bash
   npm install
   ```

2. **Configure Environment**
   Ensure your local MongoDB instance is running. The default `.env` file assumes MongoDB is running locally on `mongodb://127.0.0.1:27017` and will use the `bookstore` database.

3. **Run the API Server**
   Start the Express server:
   ```bash
   npm start
   ```
   The server will listen on `http://localhost:3000`.

4. **Run the Database Queries Demo**
   To execute the 15 required queries (insertions, updates, aggregations, etc.) and generate the 35+ records, open a new terminal and run:
   ```bash
   npm run demo
   ```
   This will output the results of all 15 queries to the console.

## API Documentation & Sample Requests

You can use Postman or Swagger to test these endpoints. Below are sample requests and responses.

### 1. GET /api/books
Fetch all books in the database.

- **Request:**
  ```http
  GET http://localhost:3000/api/books
  ```
- **Response (200 OK):**
  ```json
  [
    {
      "_id": "645abc123def456...",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "price": 15.99,
      "genres": ["Classic", "Fiction"],
      "stock": 10
    }
  ]
  ```

### 2. GET /api/books/:id
Fetch a specific book by its ID.

- **Request:**
  ```http
  GET http://localhost:3000/api/books/645abc123def456...
  ```
- **Response (200 OK):**
  ```json
  {
    "_id": "645abc123def456...",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "price": 15.99,
    "genres": ["Classic", "Fiction"],
    "stock": 10
  }
  ```

### 3. POST /api/books
Add a new book.

- **Request:**
  ```http
  POST http://localhost:3000/api/books
  Content-Type: application/json

  {
    "title": "1984",
    "author": "George Orwell",
    "price": 14.99,
    "genres": ["Dystopian", "Sci-Fi"],
    "stock": 25,
    "publishedYear": 1949
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Book created",
    "id": "645bcd123def456..."
  }
  ```

### 4. PUT /api/books/:id
Update an existing book.

- **Request:**
  ```http
  PUT http://localhost:3000/api/books/645bcd123def456...
  Content-Type: application/json

  {
    "price": 12.99,
    "stock": 20
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Book updated successfully"
  }
  ```

### 5. DELETE /api/books/:id
Delete a book by ID.

- **Request:**
  ```http
  DELETE http://localhost:3000/api/books/645bcd123def456...
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Book deleted successfully"
  }
  ```

## Demo Video Instructions
For your submission, use screen recording software to:
1. Start the server (`npm start`).
2. Run the queries demo (`npm run demo`) and show the console output.
3. Open Postman and demonstrate hitting each of the 5 API endpoints (`POST`, `GET`, `GET/ID`, `PUT`, `DELETE`).

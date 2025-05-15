const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // Get username and password from request body
  const { username, password } = req.body;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  // Check if username already exists
  if (users.some(user => user.username === username)) {
    return res.status(409).json({message: `Username ${username} already exists`});
  }
  
  // Register new user
  users.push({ username, password });
  return res.status(200).json({message: "User successfully registered. Now you can login."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Return the complete list of books in JSON format
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Retrieve the ISBN from request parameters
  const isbn = req.params.isbn;
  
  // Check if the book with given ISBN exists
  if(books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Retrieve the author from request parameters
  const author = req.params.author;
  
  // Get all keys (ISBNs) from the books object
  const bookKeys = Object.keys(books);
  
  // Filter books by the specified author
  const filteredBooks = bookKeys
    .filter(key => books[key].author.toLowerCase() === author.toLowerCase())
    .reduce((result, key) => {
      result[key] = books[key];
      return result;
    }, {});
  
  // Check if any books were found
  if(Object.keys(filteredBooks).length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({message: `No books found by author: ${author}`});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Retrieve the title from request parameters
  const title = req.params.title;
  
  // Get all keys (ISBNs) from the books object
  const bookKeys = Object.keys(books);
  
  // Filter books by the specified title
  const filteredBooks = bookKeys
    .filter(key => books[key].title.toLowerCase() === title.toLowerCase())
    .reduce((result, key) => {
      result[key] = books[key];
      return result;
    }, {});
  
  // Check if any books were found
  if(Object.keys(filteredBooks).length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({message: `No books found with title: ${title}`});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Retrieve the ISBN from request parameters
  const isbn = req.params.isbn;
  
  // Check if the book with given ISBN exists
  if(books[isbn]) {
    // Return the reviews for that book
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
});

// Async-Await/Promise versions of the above functions

// Task 10: Get the book list using Async-Await
public_users.get('/async/books', async function (req, res) {
  try {
    const bookList = await new Promise((resolve) => {
      resolve(books);
    });
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books", error: error.message });
  }
});

// Task 11: Get book details based on ISBN using Async-Await
public_users.get('/async/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    const book = await new Promise((resolve, reject) => {
      const bookDetails = books[isbn];
      if (bookDetails) {
        resolve(bookDetails);
      } else {
        reject(new Error(`Book with ISBN ${isbn} not found`));
      }
    });
    
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 12: Get book details based on author using Promises
public_users.get('/async/author/:author', function (req, res) {
  const author = req.params.author;
  
  new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    const filteredBooks = bookKeys
      .filter(key => books[key].author.toLowerCase() === author.toLowerCase())
      .reduce((result, key) => {
        result[key] = books[key];
        return result;
      }, {});
    
    if (Object.keys(filteredBooks).length > 0) {
      resolve(filteredBooks);
    } else {
      reject(new Error(`No books found by author: ${author}`));
    }
  })
  .then(filteredBooks => {
    return res.status(200).json(filteredBooks);
  })
  .catch(error => {
    return res.status(404).json({ message: error.message });
  });
});

// Task 13: Get all books based on title using Promises
public_users.get('/async/title/:title', function (req, res) {
  const title = req.params.title;
  
  new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    const filteredBooks = bookKeys
      .filter(key => books[key].title.toLowerCase() === title.toLowerCase())
      .reduce((result, key) => {
        result[key] = books[key];
        return result;
      }, {});
    
    if (Object.keys(filteredBooks).length > 0) {
      resolve(filteredBooks);
    } else {
      reject(new Error(`No books found with title: ${title}`));
    }
  })
  .then(filteredBooks => {
    return res.status(200).json(filteredBooks);
  })
  .catch(error => {
    return res.status(404).json({ message: error.message });
  });
});

module.exports.general = public_users;

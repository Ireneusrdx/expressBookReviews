const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Check if username exists and is not empty
  return username !== undefined && username.trim() !== '';
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Check if username and password match the one in records
  const user = users.find(u => u.username === username && u.password === password);
  return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  // Get username and password from request body
  const { username, password } = req.body;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  // Check if the username and password match
  if (authenticatedUser(username, password)) {
    // Generate JWT token
    const token = jwt.sign({ username: username }, "access_token_secret", { expiresIn: '1h' });
    
    // Store JWT token in session
    req.session.authorization = { token };
    
    return res.status(200).json({
      message: "Successfully logged in",
      token: token
    });
  } else {
    return res.status(401).json({message: "Invalid username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Get ISBN from request parameters
  const isbn = req.params.isbn;
  
  // Get review from request query
  const review = req.query.review;
  
  // Get username from the session
  const username = req.user.username;
  
  // Check if the book with given ISBN exists
  if(!books[isbn]) {
    return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
  
  // Check if review is provided
  if(!review) {
    return res.status(400).json({message: "Review text is required"});
  }
  
  // Add or modify the review
  books[isbn].reviews[username] = review;
  
  return res.status(200).json({
    message: "Review successfully added/modified",
    book: books[isbn]
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Get ISBN from request parameters
  const isbn = req.params.isbn;
  
  // Get username from the session
  const username = req.user.username;
  
  // Check if the book with given ISBN exists
  if(!books[isbn]) {
    return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
  
  // Check if the user has a review for this book
  if(!books[isbn].reviews[username]) {
    return res.status(404).json({message: `No review found for ISBN ${isbn} by user ${username}`});
  }
  
  // Delete the review
  delete books[isbn].reviews[username];
  
  return res.status(200).json({
    message: "Review successfully deleted",
    book: books[isbn]
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

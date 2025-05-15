# Express Book Reviews API

This repository contains an Express.js application for managing book reviews through a RESTful API.

## Features

- Browse books by ISBN, author, or title
- Read book reviews
- User registration and authentication
- Add/modify/delete book reviews (for authenticated users)
- Implementation with both synchronous and async/promise-based approaches

## Documentation

Visit our [API Documentation](https://ireneusrdx.github.io/expressBookReviews/) for complete details about the available endpoints and how to use them.

## Running Locally

1. Clone this repository
2. Navigate to the project directory: `cd expressBookReviews/final_project`
3. Install dependencies: `npm install`
4. Start the server: `node index.js`
5. The API will be available at `http://localhost:5000`

## API Endpoints

### General User Endpoints
- `GET /`: Get all books
- `GET /isbn/:isbn`: Get book by ISBN
- `GET /author/:author`: Get books by author
- `GET /title/:title`: Get books by title
- `GET /review/:isbn`: Get book reviews

### User Management
- `POST /register`: Register a new user
- `POST /customer/login`: Login as a registered user

### Authenticated User Endpoints
- `PUT /customer/auth/review/:isbn`: Add/update a book review
- `DELETE /customer/auth/review/:isbn`: Delete a book review

### Async/Promise Implementations
- `GET /async/books`: Get all books (async)
- `GET /async/isbn/:isbn`: Get book by ISBN (async)
- `GET /async/author/:author`: Get books by author (promise)
- `GET /async/title/:title`: Get books by title (promise)
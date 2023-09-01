const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
const app = express();
let users = [];

const jwtSecretKey = "rdo5fzBeGssRo6p8IuTiSysOlyLQeH3P";

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/; // Example: Username should be 3-16 characters, alphanumeric, and may contain underscores and hyphens

  // Test the username against the regex pattern
  return usernameRegex.test(username);
};

// Example usage:
const username = "my_valid_username";
const isUsernameValid = isValid(username);
console.log(`Is username valid? ${isUsernameValid}`);

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  // Find a user with a matching username
  const user = users.find((user) => user.username === username);

  // If a user with the provided username is found, check the password
  if (user) {
    if (user.password === password) {
      // Username and password match
      return true;
    }
  }

  // Username and/or password do not match
  return false;
};

// Example usage:
const inputUsername = "user1";
const inputPassword = "password1";
const isAuthenticated = authenticatedUser(inputUsername, inputPassword);

if (isAuthenticated) {
  console.log("Authentication successful");
} else {
  console.log("Authentication failed");
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find the user based on the provided username
  const user = users.find((user) => user.username === username);

  // Check if the user exists and the password is correct (for demonstration purposes)
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Sign a JWT token with the user's username as the payload
  const token = jwt.sign({ username: user.username }, jwtSecretKey);

  // Respond with the JWT token (you can customize the response as needed)
  res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const requestedIsbn = req.params.isbn;
  const { reviewText } = req.body;

  // Check if the user is authenticated (you can add your authentication logic here)
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if the requested ISBN exists in the books database
  if (!books.hasOwnProperty(requestedIsbn)) {
    return res
      .status(404)
      .json({ message: `Book with ISBN ${requestedIsbn} not found` });
  }

  // Get the book based on ISBN
  const book = books[requestedIsbn];

  // Add or update the review to the book's reviews object
  book.reviews[req.user.username] = reviewText;

  // Respond with a success message (you can customize the response as needed)
  res.status(200).json({ message: "Review added/updated successfully", book });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

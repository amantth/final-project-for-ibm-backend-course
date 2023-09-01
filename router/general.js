const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jwtSecretKey = "Hjsdf8&kD3l1Q!#j2lf9A$kx0@P1sR6T";
const axios = require("axios");

const getBooksUsingAxios = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("/books") //
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
// Function to get book details based on ISBN using Axios with Promises (Callbacks)
const getBookDetailsByISBNUsingAxios = (isbn) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/books/${isbn}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Example usage:
const isbn = "1234567890";
getBookDetailsByISBNUsingAxios(isbn)
  .then((bookDetails) => {
    console.log("Book details:", bookDetails);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
// Function to get book details based on author using Axios with Promises (Callbacks)
const getBookDetailsByAuthorUsingAxios = (author) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`books?author=${author}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Example usage:
const author = "Chinua Achebe"; // Replace with the author's name you want to search
getBookDetailsByAuthorUsingAxios(author)
  .then((booksByAuthor) => {
    console.log("Books by author:", booksByAuthor);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // Check if the username already exists
  if (users.some((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

  // Create a new user object and add it to the users array (for demonstration purposes)
  const newUser = { username, password };
  users.push(newUser);

  // Respond with a success message (in a real application, you'd likely create a user in a database)
  res
    .status(201)
    .json({ message: "User registered successfully", user: newUser });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  res.send(JSON.stringify({ books }, null));
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const requestedIsbn = req.params.isbn;
  let foundBooks = [];

  // Iterate through the books and check if any match the requested ISBN
  for (const bookId in books) {
    const book = books[bookId];
    if (book.isbn === requestedIsbn) {
      foundBooks.push({
        id: bookId,
        author: book.author,
        title: book.title,
      });
    }
  }

  if (foundBooks.length > 0) {
    // If books with the provided ISBN are found, send them as a response
    res.status(200).json(foundBooks);
  } else {
    // If no books match the given ISBN, send a 404 Not Found response
    res.status(404).json({ message: "No books found with the provided ISBN" });
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const requestedAuthor = req.params.author;
  let foundBooks = [];

  // Iterate through the books and check if any match the requested author
  for (const bookId in books) {
    const book = books[bookId];
    if (book.author === requestedAuthor) {
      foundBooks.push({
        id: bookId,
        title: book.title,
        isbn: book.isbn, // You can include ISBN if it's available
      });
    }
  }

  if (foundBooks.length > 0) {
    // If books by the provided author are found, send them as a response
    res.status(200).json(foundBooks);
  } else {
    // If no books by the given author are found, send a 404 Not Found response
    res
      .status(404)
      .json({ message: `No books found by author: ${requestedAuthor}` });
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const requestedTitle = req.params.title;
  let foundBooks = [];

  // Iterate through the books and check if any match the requested title
  for (const bookId in books) {
    const book = books[bookId];
    if (book.title.toLowerCase().includes(requestedTitle.toLowerCase())) {
      foundBooks.push({
        id: bookId,
        author: book.author,
        title: book.title,
        isbn: book.isbn, // You can include ISBN if it's available
      });
    }
  }

  if (foundBooks.length > 0) {
    // If books with the provided title are found, send them as a response
    res.status(200).json(foundBooks);
  } else {
    // If no books with the given title are found, send a 404 Not Found response
    res
      .status(404)
      .json({ message: `No books found with title: ${requestedTitle}` });
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const requestedIsbn = req.params.isbn;

  // Check if the requested ISBN exists in the books database
  if (books.hasOwnProperty(requestedIsbn)) {
    const book = books[requestedIsbn];
    const reviews = book.reviews;

    // Check if there are reviews for the book
    if (Object.keys(reviews).length > 0) {
      // If there are reviews for the book, send them as a response
      res.status(200).json({ isbn: requestedIsbn, reviews });
    } else {
      // If no reviews are found for the book, send a message
      res.status(200).json({
        isbn: requestedIsbn,
        reviews: [],
        message: "No reviews found for this book",
      });
    }
  } else {
    // If the requested ISBN is not found in the database, send a 404 Not Found response
    res
      .status(404)
      .json({ message: `Book with ISBN ${requestedIsbn} not found` });
  }

  // Return a "Yet to be implemented" response
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;

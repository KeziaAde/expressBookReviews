const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  return !users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
  const user = users.find(user => user.username === username && user.password === password);
  return user || null;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (authenticatedUser(username, password)) {
    console.log("user valid");
    req.session.authorization = {
      accessToken: jwt.sign({ username: authenticatedUser.username }, 'book_list_member'),
      username: authenticatedUser
    };

    res.status(200).json({ message: 'Login successful', user: authenticatedUser });
  } else {
    res.status(404).json({ message: `Invalid username or password.` });
    console.log("users", users);
  }
});

// Add a book review
regd_users.post("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;
  console.log(req.session.authorization.accessToken);


  if (books[isbn] && review !== "") {
    if (existingReviews) {
      existingReviews = books[isbn].reviews || {};
      existingReviews.push({"username": username, "review": review});
    }

    // Send the book details in the response
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.status(404).json({ message: `Invalid review or ISBN` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

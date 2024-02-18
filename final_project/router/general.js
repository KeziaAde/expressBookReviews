const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Promisified function for Axios POST request
const axiosPost = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

public_users.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (isValid(username) && password !== "") {
      users.push({ "username": username, "password": password });
      res.send(`New user created for ${username}`);
    } else {
      res.status(404).json({ message: `Please enter a valid username and password!` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Helper function for handling Axios GET requests
const axiosGet = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

public_users.get('/', async (req, res) => {
  try {
    const booksData = await axiosGet('http://your-api-domain/');
    res.send(JSON.stringify(booksData, null, 4));
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const bookData = await axiosGet(`http://your-api-domain/isbn/${isbn}`);
    res.send(JSON.stringify(bookData, null, 4));
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const authorBooksData = await axiosGet(`http://your-api-domain/author/${author}`);
    res.send(JSON.stringify(authorBooksData, null, 4));
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const titleBooksData = await axiosGet(`http://your-api-domain/title/${title}`);
    res.send(JSON.stringify(titleBooksData, null, 4));
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const reviewsData = await axiosGet(`http://your-api-domain/review/${isbn}`);
    res.send(JSON.stringify(reviewsData, null, 4));
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports.general = public_users;

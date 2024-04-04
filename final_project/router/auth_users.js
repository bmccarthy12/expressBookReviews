const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
/*  const validUser = users.filter((user) => user.username === username);
  return validUser.length > 0;
}*/
let userswithsamename = users.filter((user)=>{
  return user.username === username
});
if(userswithsamename.length > 0){
  return true;
} else {
  return false;
}
}

const authenticatedUser = (username,password)=>{ 
  let validUsers = users.filter((user) => {
    return (user.username == username && user.password == password)
  })
  if (validUsers.length > 0) {
    return true;
  }
  else {
    return false;
  }
  
  //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"})
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60 * 60});

    req.session.authorization = { accessToken, username }
  
  return res.status(200).send("User Successfully logged in")
  }
  else
    return res.status(208).send("Invalid Login. Check username and password")

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  let book = books[isbn];
  if (!book) {
    return res.status(404).send("The book is not found")
  }
  else {
    const review = req.body;
    book.reviews[username] = review;
    res.send(book);
  }

  regd_users.put("/auth/delete/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    let book = books[isbn];
    if (!book) {
      return res.status(404).send("The book is not found")
    }
    else {
     delete book.reviews[username];
     return res.status(200).send("Review Deleted");
    }
  });
});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

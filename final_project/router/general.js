const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;


const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
/*public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = []
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'author' && book[i][1] == req.params.author){
                author.push(books[key]);
            }
        }
    }
    if(author.length == 0){
        return res.status(300).json({message: "Author not found"});
    }
    else res.send(author);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = []
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'title' && book[i][1] == req.params.title){
                title.push(books[key]);
            }
        }
    }
    if(title.length == 0){
        return res.status(300).json({message: "Book not found"});
    }
    else res.send(title);
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  console.log(isbn);
  //if (books[isbn].review == null){
  //  return res.status(300).json({message: "There are no reviews for this book"});
  //}
  res.send(books[isbn].reviews);
  //return res.status(300).json({message: "Yet to be implemented"});
});
*/

//task 10: Async get all books
function getBooks(){
  return new Promise((resolve,reject)=>{resolve(books);
  })
}

public_users.get('/',function (req,res){
  getBooks().then(
    (b)=>res.send(JSON.stringify(b,null,4)),
    (error) => res.send("not found")
    );
});

//task11: Async get books by isbn
function getISBN(isbn){
  return new Promise((resolve,reject)=>{
    resolve(books[isbn]);
  })
}

public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  getISBN(isbn).then(
    (b)=>res.send(JSON.stringify(b,null,4)),
    (error) => res.send(error)
  )
 });

 //task 12: Async get books by isbn
 function getAuthor(author){
  return new Promise((resolve,reject)=>{
    let b = [];
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'author' && book[i][1] === author){
                b.push(books[key]);
            }
        }
    }
    resolve(b);
  })
}

public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  getAuthor(author).then(
    (b)=>res.send(JSON.stringify(b,null,4)),
    (error) => res.send(error)
  )
 });

 //task 13: Async get books by isbn
 function getTitle(title){
  return new Promise((resolve,reject)=>{
    let b = []
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'title' && book[i][1] === title){
                b.push(books[key]);
            }
        }
    }
    resolve(b);
  })
}

public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  getTitle(title).then(
    (b)=>res.send(JSON.stringify(b,null,4)),
    (error) => res.send(error)
  )
 });

module.exports.general = public_users;

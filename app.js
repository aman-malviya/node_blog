const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");
const favicon = require("express-favicon");
const app = express();

//Favicon
app.use(favicon(__dirname + "/public/Assets/favicon.png"));

// CONNECTING TO MONGOOSE DATABASE
mongoose.connect(
  "mongodb+srv://blanche:aman258@cluster0.onajj.mongodb.net/blanche?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

//Newsletter Schema And Model

const newsletterSchema = new mongoose.Schema({
  email: String,
});
const Email = mongoose.model("Email", newsletterSchema);

//CONTACT SCHEMA AND MODEL

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
});
const Contact = mongoose.model("Contact", contactSchema);

// BLOG SCHEMA AND MODEL
const blogPostSchema = new mongoose.Schema({
  authorName: String,
  blogTitle: String,
  blogDescription: String,
  blogContent: String,
  blogCategory: String,
  blogDate: String,
  sortByDate: Date,
});
const BlogPost = mongoose.model("BlogPost", blogPostSchema);

//Category Schema
const catSchema=new mongoose.Schema({
  category:String
})
const Cat=mongoose.model("Cat", catSchema);


// BODY_PARSER
app.use(express.json());
app.use(express.urlencoded());


// STATIC DIRECTORY
app.use(express.static(__dirname + "/public"));

// VIEW ENGINE TO EJS
app.set("view engine", "ejs");

// GET REQUEST TO HOME ROUTE
app.get("/home", function (req, res) {
  BlogPost.find({}, function (err, foundPosts) {
    if (err) {
      console.log(err);
    } else {
      Cat.find({}, function(err, foundCats){
        if(err){
          console.log(err);
        }else{
          res.render("home", { posts: foundPosts, categories:foundCats });
        }
      })
    }
  }).sort({ sortByDate: -1 });
});

//GET REQUEST TO ABOUT ROUTE
app.get("/about", function (req, res) {
  res.render("about");
});

//GET REQUEST TO CONTACT ROUTE
app.get("/contact", function (req, res) {
  res.render("contact");
});

//POST REQUEST TO CONTACT ROUTE
app.post("/contact", function (req, res) {
  const contact = new Contact({
    name: req.body.clientName,
    email: req.body.clientEmail,
    subject: req.body.subject,
    message: req.body.clientMessage,
  });
  contact.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("msg-sent");
    }
  });
});

// GET REQUEST TO CATEGORY ROUTE
app.get("/categories/:category", function (req, res) {
  BlogPost.find({blogCategory:req.params.category}, function (err, foundPosts) {
    if (err) {
      console.log(err);
    } else {
      Cat.find({}, function(err, foundCats){
        if(err){
          console.log(err);
        }else{
          res.render("category-page", { posts: foundPosts, categories:foundCats });
        }
      })
    }
  }).sort({ sortByDate: -1 });
});

let sortDate;
let postDate;
//GET REQUEST TO COMPOSE ROUTE
app.get("/compose", function (req, res) {

  // DATE CREATION
  const today = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  postDate = months[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear();
  sortDate = today.toISOString();


  Cat.find({}, function(err, foundCats){
        if(err){
          console.log(err);
        }else{
          res.render("compose", {categories:foundCats, imgName:sortDate });
        }
  })
});

//POST REQUEST TO COMPOSE ROUTE
app.post("/compose", function (req, res) {

  const blogPost = new BlogPost({
    authorName: req.body.author,
    blogTitle: req.body.title,
    blogDescription: req.body.description,
    blogContent: req.body.content,
    blogCategory: req.body.category,
    blogDate: postDate,
    sortByDate: sortDate,
  });
  blogPost.save();
  res.redirect("/home");
});

//GET REQUEST TO POST ROUTE
app.get("/posts/:postId", function (req, res) {
  BlogPost.findOne({ _id: req.params.postId }, function (err, foundItem) {
    if (err) {
      console.log(err);
    } else {     
        Cat.find({}, function(err, foundCats){
        if(err){
          console.log(err);
        }else{
          res.render("post", { post: foundItem, categories:foundCats });
        }
      })
    }
  });
});

//Newsletter Post Request
app.post("/newsletter-signUp", function (req, res) {
  const email = new Email({
    email: req.body.subscriber,
  });
  email.save();
  res.render("signed-up");
});

//LISTENING TO PORT
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started");
});

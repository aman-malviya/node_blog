const express = require("express");
const bodyParser = require("body-parser");
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

//MULTER SETUP
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// CONNECTING TO MONGOOSE DATABASE
mongoose.connect(
  "mongodb+srv://blog-admin-aman:aman.blog@cluster0.onajj.mongodb.net/newBlogDB?retryWrites=true&w=majority",
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
  blogImage: JSON,
  blogCategory: String,
  blogDate: String,
  sortByDate: Date,
});
const BlogPost = mongoose.model("BlogPost", blogPostSchema);

//Physics posts schema and model
const physicsPostSchema = new mongoose.Schema({
  authorName: String,
  blogTitle: String,
  blogDescription: String,
  blogContent: String,
  blogImage: JSON,
  blogCategory: String,
  blogDate: String,
  sortByDate: Date,
});
const PhysicsPost = mongoose.model("PhysicsPost", physicsPostSchema);

//Facts posts schema and model
const factsPostSchema = new mongoose.Schema({
  authorName: String,
  blogTitle: String,
  blogDescription: String,
  blogContent: String,
  blogImage: JSON,
  blogCategory: String,
  blogDate: String,
  sortByDate: Date,
});
const FactsPost = mongoose.model("FactsPost", factsPostSchema);

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
const postDate =
  months[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear();
const sortDate = today.toISOString();


// BODY_PARSER
app.use(bodyParser.urlencoded({ extended: true }));

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
      res.render("home", { posts: foundPosts });
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

// GET REQUEST TO PHYSICS ROUTE
app.get("/categories/physics", function (req, res) {
  PhysicsPost.find({}, function (err, foundPhysicsPosts) {
    if (err) {
      console.log(err);
    } else {
      res.render("physics", { physicsPosts: foundPhysicsPosts });
    }
  }).sort({ sortByDate: -1 });
});

//GET REQUEST TO FACTS ROUTE
app.get("/categories/facts", function (req, res) {
  FactsPost.find({}, function (err, foundFactsPosts) {
    if (err) {
      console.log(err);
    } else {
      res.render("facts", { factsPosts: foundFactsPosts });
    }
  }).sort({ sortByDate: -1 });
});

//GET REQUEST TO COMPOSE ROUTE
app.get("/compose", function (req, res) {
  res.render("compose");
});

// Get routes for default blogs
app.get("/default/space", function (req, res) {
  res.render("space");
});
app.get("/default/hypnic", function (req, res) {
  res.render("hypnic");
});
app.get("/default/russel", function (req, res) {
  res.render("russel");
});

//POST REQUEST TO COMPOSE ROUTE
app.post("/compose", upload.single("inputfile"), function (req, res) {
  const blogPost = new BlogPost({
    authorName: req.body.author,
    blogTitle: _.capitalize(_.lowerCase(_.kebabCase(req.body.title))),
    blogDescription: req.body.description,
    blogContent: req.body.content,
    blogImage: req.file,
    blogCategory: req.body.category,
    blogDate: postDate,
    sortByDate: sortDate,
  });

  blogPost.save();

  if (req.body.category == "Physics") {
    const physicsPost = new PhysicsPost({
      authorName: req.body.author,
      blogTitle: _.capitalize(_.lowerCase(_.kebabCase(req.body.title))),
      blogDescription: req.body.description,
      blogContent: req.body.content,
      blogImage: req.file,
      blogCategory: req.body.category,
      blogDate: postDate,
      sortByDate: sortDate,
    });
    physicsPost.save();
  } else {
    const factsPost = new FactsPost({
      authorName: req.body.author,
      blogTitle: _.capitalize(_.lowerCase(_.kebabCase(req.body.title))),
      blogDescription: req.body.description,
      blogContent: req.body.content,
      blogImage: req.file,
      blogCategory: req.body.category,
      blogDate: postDate,
      sortByDate: sortDate,
    });
    factsPost.save();
  }
  res.redirect("/home");
});

//EXPRESS ROUTE PARAMETERS
app.get("/posts/:postId", function (req, res) {
  const requestedID = _.capitalize(_.lowerCase(_.kebabCase(req.params.postId)));
  PhysicsPost.findOne({ blogTitle: requestedID }, function (err, foundItem) {
    if (err) {
      console.log(err);
    } else {
      if (!foundItem) {
        FactsPost.findOne({ blogTitle: requestedID }, function (
          err,
          foundFact
        ) {
          if (err) {
            console.log(err);
          } else {
            res.render("facts-post", { factPost: foundFact });
          }
        });
      } else {
        res.render("physics-post", { physicsPost: foundItem });
      }
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

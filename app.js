const express = require("express");
const ejs = require("ejs");
// const multer = require("multer");
const mongoose = require("mongoose");
const favicon = require("express-favicon");
// const { GridFsStorage } = require("multer-gridfs-storage");
// const Grid = require("gridfs-stream");
const app = express();
require("dotenv").config();

//Favicon
app.use(favicon(__dirname + "/public/Assets/favicon.png"));

// CONNECTING TO MONGOOSE DATABASE
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database successfully connected.");
  })
  .catch((err) => {
    console.log("Could not connect to database", err);
  });

//Multer
// const storage = new GridFsStorage({
//   url: process.env.DB,
//   options: {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   file: (req, file) => {
//     const match = ["image/png", "image/jpeg"];

//     if (match.indexOf(file.mimetype) === -1) {
//       const filename = `${Date.now()}`;
//       return filename;
//     }
//     return {
//       bucketName: "photos",
//       filename: `${Date.now()}`,
//     };
//   },
// });

//Grid FS Stream
// let gfs;
// let conn = mongoose.connection;
// conn.once("open", () => {
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection("photos");
// });

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
  // blogBanner: String,
  timeStamp: Date,
});
const BlogPost = mongoose.model("BlogPost", blogPostSchema);

//Category Schema
const catSchema = new mongoose.Schema({
  category: String,
});
const Cat = mongoose.model("Cat", catSchema);

// BODY_PARSER
app.use(express.json());
app.use(express.urlencoded());

// STATIC DIRECTORY
app.use(express.static(__dirname + "/public"));

// VIEW ENGINE TO EJS
app.set("view engine", "ejs");

//GET REQUEST TO /
app.get("/", (req, res) => {
  return res.redirect("/home");
});

// GET REQUEST TO HOME ROUTE
app.get("/home", function (req, res) {
  BlogPost.find({}, function (err, foundPosts) {
    if (err) {
      console.log(err);
    } else {
      Cat.find({}, function (err, foundCats) {
        if (err) {
          console.log(err);
        } else {
          res.render("home", { posts: foundPosts, categories: foundCats });
        }
      });
    }
  }).sort({ timeStamp: -1 });
});

//GET REQUEST TO ABOUT ROUTE
app.get("/about", function (req, res) {
  Cat.find({}, function (err, foundCats) {
    if (err) {
      console.log(err);
    } else {
      res.render("about", { categories: foundCats });
    }
  });
});

//GET REQUEST TO CONTACT ROUTE
app.get("/contact", function (req, res) {
  Cat.find({}, function (err, foundCats) {
    if (err) {
      console.log(err);
    } else {
      res.render("contact", { categories: foundCats });
    }
  });
});

//POST REQUEST TO CONTACT ROUTE
app.post("/contact", function (req, res) {
  Cat.find({}, function (err, foundCats) {
    if (err) {
      console.log(err);
    } else {
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
          res.render("msg-sent", { categories: foundCats });
        }
      });
    }
  });
});

// GET REQUEST TO CATEGORY ROUTE
app.get("/categories/:category", function (req, res) {
  BlogPost.find(
    { blogCategory: req.params.category },
    function (err, foundPosts) {
      if (err) {
        console.log(err);
      } else {
        Cat.find({}, function (err, foundCats) {
          if (err) {
            console.log(err);
          } else {
            res.render("category-page", {
              posts: foundPosts,
              categories: foundCats,
            });
          }
        });
      }
    }
  ).sort({ timeStamp: -1 });
});

//GET REQUEST TO COMPOSE ROUTE
app.get("/compose", function (req, res) {
  Cat.find({}, function (err, foundCats) {
    if (err) {
      console.log(err);
    } else {
      if (
        req.query.adminID === process.env.ADMIN_ID &&
        req.query.adminPassword === process.env.ADMIN_PASSWORD
      ) {
        res.render("compose", { categories: foundCats, authorized: true });
      } else {
        res.render("compose", { categories: foundCats, authorized: false });
      }
    }
  });
});

//POST REQUEST TO COMPOSE ROUTE
app.post("/compose", 
// multer({ storage }).single("img"), 
function (req, res) {
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
  let displayDate =
    months[today.getMonth()] +
    " " +
    today.getDate() +
    ", " +
    today.getFullYear();
  let timeStamp = today.toISOString();
  const blogPost = new BlogPost({
    authorName: req.body.author,
    blogTitle: req.body.title,
    blogDescription: req.body.description,
    blogContent: req.body.content,
    blogCategory: req.body.category,
    blogDate: displayDate,
    // blogBanner: "https://amanmalviya.herokuapp.com/images/" + req.file.filename,
    timeStamp: timeStamp,
  });
  blogPost.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/home");
    }
  });
});

//GET REQUEST TO POST ROUTE
app.get("/posts/:postId", function (req, res) {
  BlogPost.findOne({ _id: req.params.postId }, function (err, foundItem) {
    if (err) {
      console.log(err);
    } else {
      Cat.find({}, function (err, foundCats) {
        if (err) {
          console.log(err);
        } else {
          res.render("post", { post: foundItem, categories: foundCats });
        }
      });
    }
  });
});

//Newsletter Post Request
app.post("/newsletter", function (req, res) {
  Cat.find({}, function (err, foundCats) {
    if (err) {
      console.log(err);
    } else {
      const email = new Email({
        email: req.body.subscriber,
      });
      email.save();
      res.render("signed-up", { categories: foundCats });
    }
  });
});

//GET REQUEST FOR IMAGE
// app.get("/images/:filename", (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     if (err || !file) {
//       return res.status(404).json({ err: "No file exists" });
//     } else {
//       let readStream = gfs.createReadStream(file.filename);
//       readStream.pipe(res);
//     }
//   });
// });

//LISTENING TO PORT
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started");
});

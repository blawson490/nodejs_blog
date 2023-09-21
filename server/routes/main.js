const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const jwt = require('jsonwebtoken');

/**
 * GET /
 * HOME
 */
router.get("", async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJS, Express & MongoDb",
    };

    let perPage = 10;
    let page = req.query.page || 1;
    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Post :id
 */

router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await Post.findById({ _id: slug });

    const token = req.cookies.token;
    let username;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      username = decodedToken.username;
    }

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJS, Express & MongoDb",
      username: username 
    };

    res.render("post", {
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Post :id
 */
router.post("/search", async (req, res) => {
  try {

    const token = req.cookies.token;
    let username;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      username = decodedToken.username;
    }

    const locals = {
      title: "Search",
      description: "Search across the site...",
      username: username
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
        $or: [
            { title: { $regex: new RegExp(searchNoSpecialChar, 'i')}},
            { body: {$regex: new RegExp(searchNoSpecialChar, 'i')}}
        ]
    });

    res.render("search", { 
        data, 
        locals,
        searchTerm,
        currentRoute: "/search"
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", (req, res) => {
  res.render("about", {
    currentRoute: '/about'
  });
});

module.exports = router;

// function insertPostData() {
//     Post.insertMany([
//         {
//             title: "Building a Blog with NodeJS and MongoDB",
//             body: "This is the body text for the first post"
//         },
//         {
//             title: "Understanding Express Middleware",
//             body: "This is the body text for the second post"
//         },
//         {
//             title: "NodeJS Event Loop Explained",
//             body: "This is the body text for the third post"
//         },
//         {
//             title: "Working with MongoDB in NodeJS",
//             body: "This is the body text for the fourth post"
//         },
//         {
//             title: "Building RESTful APIs with NodeJS and MongoDB",
//             body: "This is the body text for the fifth post"
//         },
//         {
//             title: "NodeJS Streams Explained",
//             body: "This is the body text for the sixth post"
//         },
//         {
//             title: "Understanding Mongoose ODM",
//             body: "This is the body text for the seventh post"
//         },
//         {
//             title: "NodeJS and MongoDB Authentication",
//             body: "This is the body text for the eighth post"
//         },
//         {
//             title: "Deploying NodeJS and MongoDB Applications",
//             body: "This is the body text for the ninth post"
//         },
//         {
//             title: "Optimizing NodeJS and MongoDB Performance",
//             body: "This is the body text for the tenth post"
//         }
//     ])
// }
// insertPostData();

const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userLayout = "../views/layouts/user";
const jwtSecret = process.env.JWT_SECRET;


/*
 * Check Login Middleware
 */
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.render("user/signin", {
      locals: {
        title: "Login",
        description: "Login to Blake NodeJS Blog",
      },
      currentRoute: '/login'
    });
  }
};

/*
 * GET
 * User - Login
 */
router.get("/login", async (req, res) => {
  try {
    const locals = {
      title: "Login",
      description: "Login to Blake NodeJS Blog",
    };

    res.render("user/signin", {
      locals,
      currentRoute: '/login'
    });
  } catch (error) {
    console.log(error);
  }
});

/*
 * POST /
 * User - Check Login
 */

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.render("user/signin", {
        locals: {
          title: "Login",
          description: "Login to Blake NodeJS Blog",
          errorMessage: "Invalid credentials"
        },
        currentRoute: '/login'
      });
      return;
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/home");
  } catch (error) {
    console.log(error);
  }
});

/*
 * GET
 * User - Register
 */
router.get("/register", async (req, res) => {
  try {
    const locals = {
      title: "Sign up",
      description: "Sign up to Blake NodeJS Blog",
    };

    res.render("user/register", {
      locals,
      currentRoute: '/login'
    });
  } catch (error) {
    console.log(error);
  }
});

/*
 * POST /
 * User - Register
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const type = 'user';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword, type: type });
      const token = jwt.sign({ userId: user._id, username: user.username }, jwtSecret);
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/home");
    } catch (error) {
      if (error.code === 11000 ) {
        res.render("user/register", {
        locals: {
          title: "Sign up",
          description: "Sign up to Blake NodeJS Blog",
          errorMessage: "Username already in use"
        },
        currentRoute: '/login'
        });
      }
      res.status(500).json({ message: "Internal server error" });
        res.render("user/register", {
        locals: {
          title: "Sign up",
          description: "Sign up to Blake NodeJS Blog",
          errorMessage: "Server Error"
        },
        currentRoute: '/login'
        });
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * Get /
 * User - Home
 */
router.get("/home", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "NodeJS Blog",
      description: "Welcome to Blake NodeJS Blog",
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
    
    const decoded = jwt.verify(req.cookies.token, jwtSecret);
    const username = decoded.username;
    res.render("user/home", {
      locals,
      data,
      username,
      layout: userLayout,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/home'
    });
  } catch (error) {
    console.log(error);
  }
});

/*
 * Get /
 * User - User Dashboard
 */
router.get("/userdashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "User Dashboard",
    };
    const decoded = jwt.verify(req.cookies.token, jwtSecret);
    const username = decoded.username;

    const data = await Post.find({ author: username });

    res.render("user/userdashboard", {
      locals,
      data,
      layout: userLayout,
      username: username,
      currentRoute: '/posts'
    });
  } catch (error) {
    console.log(error);
  }
});

/*
 * Get 
 * User - Create New Post
 */
router.get("/create-post", authMiddleware, async (req, res) => {
  try {

    const decoded = jwt.verify(req.cookies.token, jwtSecret);
    const username = decoded.username;

    const locals = {
      title: "Add Post",
      description: "Create Post for Simple NodeJS Blog",
      username: username
    };
    const data = await Post.find();
    res.render("user/create-post", {
      locals,
      layout: userLayout,
      currentRoute: '/posts'
    });
  } catch (error) {
    console.log(error);
  }
});

/*
 * POST /
 * User - Create New Post
 */
router.post("/create-post", authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author
      });
      await Post.create(newPost);
      res.redirect('/dashboard')
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

/*
 * GET /
 * User - Update Post
 */
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Update Post"
    };
    const data = await Post.findOne({ _id: req.params.id });

    res.render('user/edit-post', {
      locals,
      data,
      layout: userLayout,
      currentRoute: '/posts'
    })
  } catch (error) {
    console.log(error);
  }
});

/*
 * PUT /
 * User - Update Post
 */
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {

    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    })

    res.redirect(`../post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});



module.exports = router;

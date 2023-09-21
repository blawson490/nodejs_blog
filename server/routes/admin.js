const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

/**
 *
 * Check Login
 */
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

/**
 * GET /
 * Admin - Login Page
 */
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Admin Dashboard",
    };

    res.render("admin/index", {
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Admin - Check Login
 */
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin - Logout
 */
router.get("/logout", authMiddleware, async (req, res) => {
  res.clearCookie('token');
  //res.json({ message: 'Logout successful.'});
  res.redirect('/')
});

/**
 * POST /
 * Admin - Register
 */
// router.post("/register", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const type = 'admin';
//     const hashedPassword = await bcrypt.hash(password, 10);

//     try {
//       const user = await User.create({ username, password: hashedPassword, type: type });
//       res.status(201).json({ message: "User Created", user });
//     } catch (error) {
//       if (error.code === 11000) {
//         res.status(409).json({ message: "Admin User already in use" });
//       }
//       res.status(500).json({ message: "Internal server error" });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

/**
 * Get /
 * Admin - Dashboard
 */
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Admin Dashboard",
    };
    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout
    });
  } catch (error) {
    console.log(error);
  }
});

// /*
//  * Get /
//  * Admin - Create New Post
//  */
// router.get("/add-post", authMiddleware, async (req, res) => {
//   try {
//     console.log(req.body);
//     console.log(res.body);
//     const locals = {
//       title: "Add Post",
//       description: "Create Post for Simple NodeJS Blog",
//     };
//     const data = await Post.find();
//     res.render("admin/create-post", {
//       locals,
//       layout: adminLayout
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// /**
//  * POST /
//  * Admin - Create New Post
//  */
// router.post("/add-post", authMiddleware, async (req, res) => {
//   try {
//     console.log(req.body);
//     console.log(res.body);
//     try {
//       const newPost = new Post({
//         title: req.body.title,
//         body: req.body.body,
//         author: req.body.author
//       });
//       await Post.create(newPost);
//       res.redirect('/dashboard')
//     } catch (error) {
//       console.log(error);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// /**
//  * GET /
//  * Admin - Update Post
//  */
// router.get("/edit-post/:id", authMiddleware, async (req, res) => {
//   try {
//     const locals = {
//       title: "Edit Post",
//       description: "Update Post"
//     };
//     const data = await Post.findOne({ _id: req.params.id });

//     res.render('admin/create-post', {
//       locals,
//       data,
//       layout: adminLayout
//     })
//   } catch (error) {
//     console.log(error);
//   }
// });

// /**
//  * PUT /
//  * Admin - Update Post
//  */
// router.put("/edit-post/:id", authMiddleware, async (req, res) => {
//   try {

//     await Post.findByIdAndUpdate(req.params.id, {
//       title: req.body.title,
//       body: req.body.body,
//       updatedAt: Date.now()
//     })

//     res.redirect(`../post/${req.params.id}`);
//   } catch (error) {
//     console.log(error);
//   }
// });

/**
 * DELETE /
 * Admin - Delete Post
 */
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {

    await Post.deleteOne({ _id: req.params.id });

    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");


const BlogsController = require("../controllers/blogController");

// get all Blogs
router.get("/", BlogsController.GET_BLOGS);



// getBlogBYID
router.get("/:blog_id", BlogsController.GET_BLOG_BY_ID);

//create new Blog
router.post(
  "/create",
  [
    auth,
    admin,
    [
      check("title", "title is required").not().isEmpty(),
      check("description", "description is required").not().isEmpty(),
    ],
  ],
  BlogsController.CREATE_BLOG
);

// router.post("/edit", BlogsController.EDIT_BLOG);

module.exports = router;

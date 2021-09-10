const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");


const projectController = require("../controllers/projectController");

//create new Project
router.post(
    "/create",
    [
      auth,
      admin,
      [
        check("title", "title is required").not().isEmpty(),
        check("type", "type is required").not().isEmpty(),
        check("description", "description is required").not().isEmpty(),
      ],
    ],
    projectController.CREATE_PROJECT
  );


// get all projects
router.get("/", projectController.GET_PROJECTS);



// getProejctBYID
router.get("/:project_id", projectController.GET_PROJECT_BY_ID);




// router.post("/edit", projectController.EDIT_BLOG);

module.exports = router;

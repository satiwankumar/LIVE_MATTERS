const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");


const requestController = require("../controllers/requestController");


//create new Project
router.post(
    "/create",
    [
      [
        check("partner_type", "partner_type is required").not().isEmpty(),
        // check("project", "project is required").not().isEmpty(),
        // check("description", "description is required").not().isEmpty(),
      ],
    ],
    requestController.CREATE_REQUEST
  );


// get all projects
router.get("/", requestController.GET_ALL_REQUESTS);



// getProejctBYID
router.get("/:request_id", requestController.GET_REQUEST_BY_ID);



router.post('/status/:status', [auth], requestController.UPDATE_REQUEST_STATUS)

module.exports = router;

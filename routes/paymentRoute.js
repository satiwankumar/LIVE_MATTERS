const express = require("express");
const { check } = require("express-validator");
const auth = require("../middleware/authMiddleware");

const paymentController = require("../controllers/paymentController");
const router = express.Router();




router.post(
  "/pay",
  [
    auth,
    [
      check("user", "user is required").not().isEmpty(),
      check("payment_method", "payment_method is required").not().isEmpty(),
      check("charges", " charges is required").not().isEmpty(),
      check("card_number", "card_number is required").not().isEmpty(),
      check("card_expiry", "card_expiry is required").not().isEmpty(),
      check("card_cvv", "card_cvv is required").not().isEmpty(),

    ],
  ],
  paymentController.DONATE
);



router.get(
    "/mysubscription",
    [
      auth,
    ],
    paymentController.MY_SUBSCRIPTION
  );



module.exports = router
const express = require("express");
const { baseUrl } = require("../utils/url");
const {
  CreateNotification,
  SendPushNotification,
} = require("../utils/Notification");
const { check, validationResult } = require("express-validator");
const config = require("config");
//model
const paymentModel = require("../models/payment.model")
const moment = require("moment");
const { sendRequestEmail } = require("../service/email");

const stripe = require("stripe")("sk_test_RG4EfYiSTOT8IxuNxbeMeDiy");



exports.DONATE = async (req, res) => {
  try {
    let {
     first_name,
     last_name,
     email,
     city,
     zip_code,
      charges,
      payment_method,
      card_number,
      card_expiry,
      card_cvv,
     
    } = req.body;

    let charge = "";
    let m = card_expiry.split("/");
    let cardNumber = card_number;
    let token = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: m[0],
        exp_year: m[1],
        cvc: card_cvv,
      },
    });

    if (token.error) {
      // throw new Error (token.error);
      return res.status(400).json({ message: token.error });
    }

    charge = await stripe.charges.create({
      amount: charges,
      description: "All live Matters",
      currency: "usd",
      source: token.id,
    });

    const paymentLog = new paymentModel({
      first_name: first_name,
      last_name: last_name,
      email: email,
      city: city,
      zip_code: zip_code,
      charge_id: charge.id ? charge.id : null,
      amount: charges,
      type: payment_method,
      status: charge.id ? "paid" : "unpaid",
    });


    await paymentLog.save();
 await sendRequestEmail(paymentLog,"DONATION")



    res.status(200).json({ msg: "Donating SuccessFul !" });
  } catch (err) {
    throw err;
  }
};
exports.MY_SUBSCRIPTION = async (req,res)=>{
    try {
      let error =[]
      
        let subscription = await paymentModel.findOne({ user: req.user._id}).populate('user').populate('package')
        if (!subscription) {
            error.push({ message: "No subscription Exist" })
            return res.status(400).json({ errors: error })
        }

          res.status(200).json(
            subscription
          );
    } catch (err) {
        const errors = [];
    errors.push({ message: err.message });
    res.status(500).json({ errors: errors });
    }
}
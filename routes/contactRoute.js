const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const moment = require("moment");

const Contact = require("../models/contact.model");
const admin = require("../middleware/adminMiddleware");
const auth = require("../middleware/authMiddleware");
const checkObjectId = require("../middleware/checkobjectId");
const {sendContactEmail,sendEmail} = require("../service/email");


router.post(
  "/",
  [
    check("firstname", "please enter firstname").not().isEmpty(),
    check("lastname", "please enter lastname").not().isEmpty(),
    check("phone_no", "please enter phone_no").not().isEmpty(),
    check("email", "please enter email").not().isEmpty(),
    check("subject", "please enter subject").not().isEmpty(),
    check("message", "please enter messages").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
       throw new Error(errors.toString())
      }

      //create new user
      let contact = new Contact({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,

        //   image: req.file.path
      });

      //hash passoword
      let resp =await sendContactEmail(contact)
      console.log(resp)
      await contact.save();
      res.status(200).json({
        message: "We will get back to you soon, thank you for reaching out",
      });
    } catch (err) {
      const errors = [];
      errors.push({ message: err.message });
      res.status(500).json({ errors: errors });
    }
  }
);

router.get("/", [auth, admin], async (req, res) => {
  const { page, limit, fieldname, order, from, to, keyword } = req.query;
  const currentpage = page ? parseInt(page, 10) : 1;
  const per_page = limit ? parseInt(limit, 10) : 5;
  const CurrentField = fieldname ? fieldname : "createdAt";
  const currentOrder = order ? parseInt(order, 10) : -1;
  let offset = (currentpage - 1) * per_page;
  const sort = {};
  sort[CurrentField] = currentOrder;
  // return res.json(sort)

  let Datefilter =
    from && to
      ? {
          createdAt: {
            $gte: moment(from).startOf("day").toDate(),
            $lte: moment(to).endOf("day").toDate(),
          },
        }
      : {};

  const search = keyword
    ? {
        $or: [
          { firstname: { $regex: `${keyword}`, $options: "i" } },
          { lastname: { $regex: `${keyword}`, $options: "i" } },
          { email: { $regex: `${keyword}`, $options: "i" } },
          { subject: { $regex: `${keyword}`, $options: "i" } },
        ],
      }
    : {};

  try {
    let contacts = await Contact.find({ ...search, ...Datefilter })
      .populate("user")
      .limit(per_page)
      .skip(offset)
      .sort(sort);
    // console.log(users)
    if (!contacts.length) {
      return res.status(400).json({ message: "no Contact exist" });
    }

    let Totalcount = await Contact.find({
      ...search,
      ...Datefilter,
    }).countDocuments();
    const paginate = {
      currentPage: currentpage,
      perPage: per_page,
      total: Math.ceil(Totalcount / per_page),
      to: offset,
      data: contacts,
    };
    res.status(200).json(paginate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get(
  "/:contact_id",
  [auth, admin, checkObjectId("contact_id")],
  async (req, res) => {
    let contact_id = req.params.contact_id;

    try {
      let contact = await Contact.findOne({ _id: contact_id })
        .populate("user")
        .lean();
      if (!contact)
        return res.status(400).json({ message: "contact Detail not found" });

      return res.status(200).json(contact);
    } catch (error) {
      // console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

router.post("/remove", [auth, admin], async (req, res) => {
  try {
    const contact_id = req.body.contact_id;
    const contact = await Contact.findOneAndDelete({ _id: contact_id });
    if (!contact) {
      return res.status(200).json({ message: "Feedback not found" });
    }
    return res.status(200).json({ message: "Feedback deleted Successfully" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

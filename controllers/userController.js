const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const fs = require("fs");
var path = require("path");
const { baseUrl } = require("../utils/url");
// const { CreateNotification } = require('../utils/Notification')
const { check, validationResult } = require("express-validator");
const config = require("config");
const moment = require("moment");
//model
const User = require("../models/User.model");

var isBase64 = require("is-base64");
const { GET_IMAGE_PATH } = require("../helper/helper");
const e = require("express");

exports.Register = async (req, res) => {
  try {
    // console.log(req.body);
    // console.log(req.files);
    // let image = req.files
    let error = [];
    const errors = validationResult(req);
    const url = baseUrl(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // if user duplicated
    let user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (user) {
      error.push({ message: "User already registered" });
      return res.status(400).json({ errors: error });
    }

    //if password doesnot match
    if (req.body.password !== req.body.confirmpassword) {
      error.push({ message: "confirm password doesnot match" });
      return res.status(400).json({ errors: error });
    }
    let pathName = "uploads/images/abc.jpg";
    const salt = await bcrypt.genSalt(10);

    //decode the base 4 image
    if (req.files.image) {
      let image = req.files.image ? req.files.image : "";
      pathName = await GET_IMAGE_PATH(image);
      console.log(pathName);
    }

    // }
    //create new user
    user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email.toLowerCase(),
      image: pathName,
      phone_no: req.body.phone_no ? req.body.phone_no : null,
    });

    //hash passoword
    user.password = bcrypt.hashSync(req.body.password, salt);
    const token = await user.generateAuthToken();

    await user.save();
    const notification = {
      notificationType: "Admin",
      notifiableId: null,
      title: "New User Created",
      body: "New User has been Registered",
      payload: {
        type: "users",
        id: user._id,
      },
    };
    // CreateNotification(notification)

    user.image = `${url}${user.image}`;

    res.status(200).json({
      message: "Registration Success, please login to proceed",
      token: token,
      createdUser: user,
      //  data: JSON.stringify(response1.data)
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.GetUsers = async (req, res) => {
  const { page, limit, selection, fieldname, order, from, to, keyword } =
    req.query;
  const currentpage = page ? parseInt(page, 10) : 1;
  const per_page = limit ? parseInt(limit, 10) : 5;
  const CurrentField = fieldname ? fieldname : "createdAt";
  const currentOrder = order ? parseInt(order, 10) : -1;
  let offset = (currentpage - 1) * per_page;
  const sort = {};
  sort[CurrentField] = currentOrder;
  // return res.json(sort)

  const currentSelection = selection ? { status: selection } : {};
  //date filter
  // let Datefilter = from && to ?
  //  { createdAt: { $gte: moment(from).startOf('day').toDate(), $lte: moment(to).endOf('day').toDate() } }
  // : {}

  let Datefilter = "";
  if (from && to) {
    Datefilter =
      from && to
        ? {
            createdAt: {
              $gte: moment(from).startOf("day").toDate(),
              $lte: moment(to).endOf("day").toDate(),
            },
          }
        : {};
    console.log("fromto", Datefilter);
  } else if (from) {
    console.log("from");
    Datefilter = from
      ? {
          createdAt: {
            $gte: moment(from).startOf("day").toDate(),
            $lte: moment(new Date()).endOf("day").toDate(),
          },
        }
      : {};
    console.log("from", Datefilter);
  } else if (to) {
    console.log.apply("to");
    Datefilter = to
      ? { createdAt: { $lte: moment(to).endOf("day").toDate() } }
      : {};
    console.log("to", Datefilter);
  }

  const search = keyword
    ? {
        $or: [
          { firstname: { $regex: `${keyword}`, $options: "i" } },
          { lastname: { $regex: `${keyword}`, $options: "i" } },
          { email: { $regex: `${keyword}`, $options: "i" } },
        ],
      }
    : {};

  // console.log(Datefilter)
  try {
    let users = await User.find({
      ...currentSelection,
      ...Datefilter,
      ...search,
      isAdmin: false,
    })
      .limit(per_page)
      .skip(offset)
      .sort(sort);
    // console.log(users)
    if (!users.length) {
      return res.status(400).json({ message: "no user exist" });
    }
    const url = baseUrl(req);
    users.forEach((user) => (user.image = `${url}${user.image}`));
    let Totalcount = await User.find({
      ...currentSelection,
      ...Datefilter,
      ...search,
      isAdmin: false,
    }).countDocuments();
    const paginate = {
      currentPage: currentpage,
      perPage: per_page,
      total: Math.ceil(Totalcount / per_page),
      to: offset,
      data: users,
    };
    res.status(200).json(paginate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.EditProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  const {
    firstname,
    lastname,
    city,
    country,
    phone_no,
    image,
    state,
    zip_code,
    address,
  } = req.body;

  try {
    let user = await User.findOne({ _id: req.user._id });
    // console.log(user)
    if (!user) {
      return res.status(400).json({ message: "no  User Found" });
    }
    user.firstname = firstname;
    (user.lastname = lastname),
      (user.city = city ? city : user.city),
      (user.country = country ? country : user.country),
      (user.state = state ? state : user.state),
      (user.zip_code = zip_code ? zip_code : user.zip_code),
      (user.address = address ? address : user.address);
    user.phone_no = phone_no ? phone_no : user.phone_no;
    if (req.files.image) {
        let imagePath = req.files.image ? req.files.image : "";
        pathName = await GET_IMAGE_PATH(imagePath);
        // console.log(pathName);
     user.image = pathName
      }
      else{
    user.image =  user.image;

      }
  
    await user.save();
    const url = baseUrl(req);
    user.image = `${url}${user.image}`;
    const resuser = user;
    res.status(200).json({
      message: "Profile Updated Successfully",
      user: resuser,
    });
  } catch (err) {
    const errors = [];
    errors.push({ message: err.message });
    res.status(500).json({ errors: errors });
  }
};
exports.GetCurrentUser = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user._id }).lean();
    // console.log(user)
    if (!user) {
      return res.status(400).json({ message: "User doesnot exist" });
    }
    const url = baseUrl(req);
    user.image = `${url}${user.image}`;

    // const reviews = await Review.find({luggerUser:req.user._id}).lean()
    // let totalRating = 0
    // let length =reviews.length
    // for(let i =0;i<reviews.length;i++){
    //     totalRating = totalRating +   reviews[i].rating
    // }
    // let Average = totalRating/length
    // user.AverageRating = Average

    res.status(200).json({
      user: _.pick(user, [
        "_id",
        "firstname",
        "lastname",
        "email",
        "image",
        "averageRating",
        "city",
        "country",
        "state",
        "zip_code",
        "address",
        "phone_no",
      ]),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.GetUserById = async (req, res) => {
  let user_id = req.params.user_id;
  try {
    const user = await User.findOne({
      _id: user_id,
    });

    if (!user)
      return res.status(400).json({ message: "User Detail not found" });
    const url = baseUrl(req);
    user.image = `${url}${user.image}`;
    return res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
};
exports.ApproveAndBlockUser = async (req, res) => {
  const { status } = req.params;
  //   console.log(status)
  try {
    let user = await User.findOne({ _id: req.body.userId });
    // console.log(user)
    if (!user) {
      return res.status(400).json({ message: "no user exist " });
    }

    if (status == 1 && user.status == 1) {
      return res.json({ message: "This user is  already active " });
    } else if (status == 0 && user.status == 0) {
      return res.json({ message: "This user is already blocked" });
    }

    if (user.status == 0 && status == 1) {
      user.status = status;
      await user.save();
      return res.status(200).json({ message: "User is  Active" });
    }
    if (user.status == 1 && status == 0) {
      user.status = status;
      await user.save();
      return res.status(200).json({ message: "User is blocked" });
    } else {
      return res.status(200).json({ message: "Invalid status" });
    }
  } catch (error) {
    //   console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};
exports.UploadProfilePicture = async (req, res) => {
  try {
    let image = req.files.image ? req.files.image : "";
    let pathName = await GET_IMAGE_PATH(image);

    const url = baseUrl(req);

    res.status(200).json({
      image: pathName,
      imagepreview: `${url}${pathName}`,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.Update_User = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  const {
    firstname,
    lastname,
    city,
    country,
    state,
    zip_code,
    address,
    phone_no,
  } = req.body;

  try {
    let user = await User.findOne({ _id: req.params.userId });
    // console.log(user)
    if (!user) {
      return res.status(400).json({ message: "no  User Found" });
    }
    user.firstname = firstname;
    (user.lastname = lastname),
      (user.city = city ? city : user.city),
      (user.country = country ? country : user.country),
      (user.state = state ? state : user.state),
      (user.zip_code = zip_code ? zip_code : user.zip_code),
      (user.address = address ? address : user.address);
    user.phone_no = phone_no ? phone_no : user.phone_no;

    await user.save();
    const url = baseUrl(req);
    user.image = `${url}${user.image}`;
    const resuser = user;
    res.status(200).json({
      message: "User Profile Updated Successfully",
      user: resuser,
    });
  } catch (err) {
    const errors = [];
    errors.push({ message: err.message });
    res.status(500).json({ errors: errors });
  }
};

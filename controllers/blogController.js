
const _ = require("lodash");
const fs = require("fs");
var path = require("path");
const { baseUrl } = require("../utils/url");
const { validationResult } = require("express-validator");
//model
const blogModel = require("../models/blog.model");
const moment = require("moment");
var isBase64 = require("is-base64");
const { GET_IMAGE_PATH } = require("../helper/helper");
const cloudinary = require('cloudinary')

cloudinary.config({ 
  cloud_name: 'all-lives-matter', 
  api_key: '844554439773792', 
  api_secret: 'uonObDkRBuO-G9SXcAtcEYTwY98' 
});

exports.CREATE_BLOG = async (req, res, next) => {
  try {
    let error = [];
    const errors = validationResult(req);
    const url = baseUrl(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, description } = req.body;

    // if service already exist
    let blog = await blogModel.findOne({ title });
    if (blog) {
      error.push({ message: "Blog already Exist" });
      return res.status(400).json({ errors: error });
    }
    let pathName = "";
    // console.log(req.files)
    var cloudinaryResult = null
    if (req.files.image) {
      pathName = await GET_IMAGE_PATH(req.files.image);
    }

    

 
    
      const result = await cloudinary.uploader.upload(pathName)

      blog =  new blogModel({
        title: title,
        description: description,
        image: result.url,
      });
      await blog.save();
  



    res.status(200).json({
      message: "Blog Created Successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.GET_BLOGS = async (req, res) => {
  const { page, limit, selection, fieldname, order, from, to, keyword } =
    req.query;
  const currentpage = page ? parseInt(page, 10) : 1;
  const per_page = limit ? parseInt(limit, 10) : 3;
  const CurrentField = fieldname ? fieldname : "createdAt";
  const currentOrder = order ? parseInt(order, 10) : -1;
  let offset = (currentpage - 1) * per_page;
  const sort = {};
  sort[CurrentField] = currentOrder;
  // return res.json(sort)

  const currentSelection = selection ? selection : 1;
//   const categoryFilter = category?{category:category}:{}
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
        $or: [{ title: { $regex: `${keyword}`, $options: "i" } }],
      }
    : {};
  // return res.json(sort)
  console.log(search);

  try {
    let blogs = await blogModel
      .find({  ...Datefilter,...search })
      
      .limit(per_page ? per_page : null)
      .skip(offset)
      .sort(sort);

    // const url = baseUrl(req);
    // blogs.forEach((item) => {
    //   if (item.image) {
    //     item.image = `${url}${item.image}`;
    //   }
    // });
    const  Totalcount = await blogModel.find({ ...Datefilter,...search}).countDocuments();
    const paginate = {
      currentPage: currentpage,
      perPage: per_page,
      total: Math.ceil(Totalcount / per_page),
      to: offset,
      data: blogs,
    };
    res.status(200).json(paginate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  


exports.GET_BLOG_BY_ID = async (req, res) => {
  let blog_id = req.params.blog_id;
  try {
    const blog = await blogModel.findOne({
      _id: blog_id,
    })

    if (!blog)
      return res.status(400).json({ message: "Blog Detail not found" });
    const url = baseUrl(req);
    // blog.image = `${url}${blog.image}`;
    return res.json(blog);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
};

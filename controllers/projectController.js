
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
const projectModel = require("../models/project.model");

exports.CREATE_PROJECT = async (req, res, next) => {
  try {
    let error = [];
    const errors = validationResult(req);
    const url = baseUrl(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, description,type } = req.body;

    // if service already exist
    let project = await projectModel.findOne({ title,type });
    if (project) {
      error.push({ message: "Project already Exist" });
      return res.status(400).json({ errors: error });
    }
    let pathName = "";
    // console.log(req.files)
    var cloudinaryResult = null
    if (req.files.image) {
      pathName = await GET_IMAGE_PATH(req.files.image);
    }

    

 
    
      const result = await cloudinary.uploader.upload(pathName)
    project = new projectModel({
      title: title,
      description: description,
      type:type,
      image:result.url,
    });

    await project.save();

    res.status(200).json({
      message: "Project Created Successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.GET_PROJECTS = async (req, res) => {
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
    let projects = await projectModel
      .find({  ...Datefilter,...search })
      
      .limit(per_page ? per_page : null)
      .skip(offset)
      .sort(sort);

    const url = baseUrl(req);
    projects.forEach((item) => {
      if (item.image) {
        item.image = `${url}${item.image}`;
      }
    });
    const  Totalcount = await projectModel.find({ ...Datefilter,...search}).countDocuments();
    const paginate = {
      currentPage: currentpage,
      perPage: per_page,
      total: Math.ceil(Totalcount / per_page),
      to: offset,
      data: projects,
    };
    res.status(200).json(paginate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.GET_PROJECT_BY_ID = async (req, res) => {
  let project_id = req.params.project_id;
  try {
    const project = await projectModel.findOne({
      _id: project_id,
    })

    if (!project)
      return res.status(400).json({ message: "Project Detail not found" });
    const url = baseUrl(req);
    project.image = `${url}${project.image}`;
    return res.json(project);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
};

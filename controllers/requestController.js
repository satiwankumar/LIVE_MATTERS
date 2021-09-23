
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
const requestModel = require("../models/requests.model");
const requestsModel = require("../models/requests.model");
const { SendPushNotification } = require("../utils/Notification");

exports.CREATE_REQUEST =  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // console.log(req.body);
    const {
     
      project,
      partner_type,
      description,
      firstname,
        lastname,
        email ,
        gender,
        occupation,
        phone_no,
        message ,
   
     
    
    } = req.body;

    
    // console.log(image)



    try {
      const requests = await requestModel.find({
        project: project,
        // user: req.user._id,
        partner_type:partner_type,
        
      });
      if (requests.length)
        return res.json({ message: 'You have already sent Request on this Project' });

      let request = new requestModel({
        // user: req.user._id,
        project:project,
        partner_type:partner_type,
        description:description?description:null,
        firstname:firstname?firstname:null,
        lastname: lastname?lastname:null,
        email :   email ?email:null,
        gender:   gender?gender:null,
        occupation:occupation?occupation:null,
        phone_no: phone_no?phone_no:null,
        message : message ?message:null,
      });
     


       await request.save();
 


  
   
      return res.status(200).json({
        code: 200,
        message: 'Your request has been sent',
        request:request
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }



exports.GET_ALL_REQUESTS =  async (req, res) => {

    try {
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
        
  let requests = await requestModel.find({

    ...Datefilter,
    ...search,
  }).populate(
    'user', [
    'firstname',
    'lastname',
    'email',
    'image'
  ]
).populate({ path :'project'})
    .limit(per_page)
    .skip(offset)
    .sort(sort);
  // console.log(users)
  if (!requests.length) {
    return res
      .status(400)
      .json({ msg: 'no request found' });
  }

  const url = baseUrl(req);

  
  
      var unique = [];
    // var distinct = [];
    for( let i = 0; i < requests.length; i++ ){
      if( !unique[requests[i].user.image]){
           requests[i].user.image = `${url}${requests[i].user.image}`
        unique[requests[i].user.image] = 1;
      }
    }
  let Totalcount = await requestModel.find({

    ...Datefilter,
    ...search,
  }).countDocuments();

  const paginate = {
    currentPage: currentpage,
    perPage: per_page,
    total: Math.ceil(Totalcount / per_page),
    to: offset,
    data: requests,
  };
  res.status(200).json(paginate);


    } catch (error) {
      console.error(error.message);
      res.status(500).send('server Error');
    }
  }

exports.GET_REQUEST_BY_ID = async (req, res) => {
  let request_id = req.params.request_id;
  try {
    const request = await requestsModel.findOne({
      _id: request_id,
    }).populate('project')


    if (!request)
      return res.status(400).json({ message: "request Detail not found" });

    
    return res.json(request);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
};

exports.UPDATE_REQUEST_STATUS =  async (req, res) => {
    try {
      let request = await requestModel.findOne({ _id: req.body.request_id })
    
      if (!request)
        return res.status(400).json({ msg: 'Request doesnot exist ' });
  
    
      if (req.params.status == 1 && request.status == "ACCEPTED") {
        return res.json({ "message": 'You  have already Approved this request' });
      }
  
      if (req.params.status == 2 && request.status == "REJECTED") {
        return res.json({ message: 'You have already Rejected this request' });
      }

  
      if (req.params.status == 1 && request.status == "PENDING" ) {
        
  
         request.status = "ACCEPTED";
      
        await request.save();

  
      
  
      
  
        // console.log("request",request)
        const data = {
          notifiableId: request.user,
          title: "Request  Accepted",
          notificationType: "Request",
          body: "Request has been Accepted",
          payload: {
            "type": "MyRequest",
            "id": request._id
          }
        }
  
        const resp = SendPushNotification(data)
  
      console.log(resp)
  
        return res.status(200).json({ message: 'You request has been approved' });
      }
      else if (req.params.status == 2 && request.status == "PENDING") {
        request.status = "REJECTED";
  
        await request.save();
        const data = {
          notifiableId: request.user,
          title: "Request  Rejected",
          notificationType: "Request",
          body: "Request has been Rejected",
          payload: {
            "type": "MyRequest",
            "id": request._id
          }
        }
    
    
           const resp = SendPushNotification(data)
            console.log(resp)
        return res.status(200).json({ message: 'you request has been rejected' });
      }
     
      else{
        return res.status(500).json({ message: 'Invalid status' })
      }
      
        
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }
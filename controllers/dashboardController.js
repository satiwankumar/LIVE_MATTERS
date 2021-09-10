// const bcrypt = require("bcrypt");
// const { check, validationResult } = require("express-validator");
// const moment = require("moment");
// const _ = require("lodash");
// const { baseUrl } = require("../utils/url");

// //models

// //services
// const { sendEmail } = require("../service/email");
// const UserModel = require("../models/User.model");
// // const deliveryModel = require("../models/delivery.model");

// exports.SALES_ANALYITICS = async (req, res) => {
//   const { year } = req.query;
//   let year1 = year ? year : new Date().getFullYear();
//   try {
//     const dates = [
//       new Date(year1, 0),
//       new Date(year1, 1),
//       new Date(year1, 2),
//       new Date(year1, 3),
//       new Date(year1, 4),
//       new Date(year1, 5),
//       new Date(year1, 6),
//       new Date(year1, 7),
//       new Date(year1, 8),
//       new Date(year1, 9),
//       new Date(year1, 10),
//       new Date(year1, 11),
//     ];
//     let data = [];
//     let countData = [];
//     await Promise.all(
//       dates.map(async (date, index) => {
//         let from = moment(date).startOf("month").toDate();
//         let to = moment(date).endOf("month").toDate();
//         const uploadHour = { createdAt: { $gte: from, $lte: to } };
//         let total_requests = await asyncRunner(uploadHour);
//         // console.log(total_requests);
//         data.push({
//           count: total_requests[0].length > 0 ? total_requests[0][0].count : 0,
//           month: index,
//         });
//       })
//     );

//     data = data.sort((a, b) => a.month - b.month);
//     data.map((item) => countData.push(item.count));
//     // console.log(countData)
//     await res.status(200).json(countData);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// function asyncRunner(uploadHour) {
//   return Promise.all([test(uploadHour)]);
// }

// function test(uploadHour) {
//   // let totalusers = await
//   return new Promise((resolve, reject) => {
//     resolve(
//       deliveryModel.aggregate([
//         {
//           $match: {
//             ...uploadHour,
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             count: { $sum: 1 },
//           },
//         },
//       ])
//     );
//   });
// }

// exports.GET_TOTAL_STATS = async (req, res) => {
//   try {
//     const total_users = await UserModel.find({
//       isAdmin: false,
//     }).countDocuments();
//     const total_deliveries = await deliveryModel.find().countDocuments();
//     let data = {
//       total_users: total_users,
//       total_deliveries: total_deliveries,
//     };
//     return res.json({ totalstats: data });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "Internal Server Error",
//     });
//   }
// };

// //  console.log(countryWiseOrder)
// let data = {}
//  let mapData =  countryWiseOrder.map(item=>
//         data[item.doc.countryCode] = 0
//   )

//   const organizationOrderPerMonth = await orderModel.aggregate( [

//     { $group: { _id: "$organization", "doc":{"$first":"$$ROOT"}, total_order: { $sum: 1 },
//     total_qrcodes: {$sum :'$no_of_qr_codes'},
//     total_scanned: {$sum :'$scan_count'}
//     // "doc":{"$first":"$$ROOT"},
//     // "$replaceRoot":{"newRoot":"$doc"}
//   }

//   },
//   // {"$replaceRoot":{"newRoot":"$doc"}},
//       { $project: { _id: 0 , total_order:1,total_qrcodes:1,total_scanned:1 } }
//  ] )
// console.log(organizationOrderPerMonth)

//     return res.json({totalstats:totalstats?totalstats[0]:null,totalorganizations:totalorganizations?totalorganizations[0]:null,countryWiseOrder:countryWiseOrder,mapData: mapData?data:[]})

// } catch (err) {
//   console.log(err);
//   res.status(500).json({
//     message: "Internal Server Error",
//   });
// }
//   };

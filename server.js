const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 5000;
const connectDB = require("./config/db");
const engines = require("consolidate");
var cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
var multipart = require('connect-multiparty');
const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");
const mongoose = require("mongoose");
const Blog = require('./models/blog.model')
const Contact = require('./models/contact.model')
const Project = require('./models/project.model')
const Request = require('./models/requests.model')
const User = require('./models/User.model')
const Admin = require("./models/Admin");
const config = require('config')
const db = config.get("MongoURI");


const runServer = async () => {
  // Mongoolia

  // Admin Bro
  AdminBro.registerAdapter(AdminBroMongoose);
  let adminBro = null;

  const connection = await mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  adminBro = new AdminBro({
    databases: [connection],
    rootPath: "/admin",

    resources: [
      {
        resource: Blog,
        options: {},
      },
      {
        resource: Contact,
        options: {},
      },
      {
        resource: Project,
        options: {},
      },
      {
        resource: Request,
        options: {
          properties: {
            status: {
              availableValues: [
                { value: 'ACCEPTED', label: 'ACCEPTED' },
                { value: 'REJECTED', label: 'REJECTED' },
              ]
            }
          }
        },
      },
      {
        resource: User,
        options: {},
      },
      {
        resource: Admin,
        options: {},
      },
    ],

    branding: {
      companyName: "All Lives Matter Admin",
    },
  });

  require("dotenv").config();
  var fs = require("fs");

  //db connection
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "*");

    next();
  });

  const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
      const admin = await Admin.findOne({ email }).select("+password");
      if (admin) {
        console.log(admin);

        const isMatch = await admin.matchPassword(password);
        return isMatch;
      }
      return false;
    },
    cookiePassword: "secretSpooky",
  });
  // const router = AdminBroExpress.buildRouter(adminBro)
  app.use(adminBro.options.rootPath, router);
  app.use(multipart());

  app.use(helmet());
  app.use(xss());
  app.use(mongoSanitize());
  // gzip compression
  app.use(compression());

  app.use(cors());
  app.options("*", cors());
  app.use(express.json({ limit: "50mb" }));





  require("./routes")(app);
  app.get("/", (req, res) => {
    res.send("All lives Matter Running");
  });

  app.get("/uploads/images/:name", (req, res) => {
    // const myURL  = new URL(req.url)
    // console.log(myURL.host);

    res.sendFile(path.join(__dirname, `./uploads/images/${req.params.name}`));
  });



  app.listen(port, () => {
    console.log(`Server is running at the port ${port}`);
  });

}

connectDB();
runServer()




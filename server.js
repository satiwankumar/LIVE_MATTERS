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


require("dotenv").config();
var fs = require("fs");

//db connection
connectDB();
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "*");

  next();
});
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

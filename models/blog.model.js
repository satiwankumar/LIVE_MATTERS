const mongoose = require("mongoose");

const BlogsSchema = new mongoose.Schema({
  image: {
    type: String,
  },

  title: {
    type: String,
    required: true,
  },


  description: {
    type: String,
    default: null,
  },
});

BlogsSchema.set("timestamps", true);

module.exports = Blog = mongoose.model("Blog", BlogsSchema);

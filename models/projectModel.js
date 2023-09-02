const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: String,
  desc: String,
  link: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("Projects", projectSchema);

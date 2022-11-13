const mongoose = require("mongoose")

const File = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    //required: true,
  },
  password: String,
  downloadCount: {
    type: Number,
    required: true,
    default: 0,
  },

  mimetype: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("File", File)

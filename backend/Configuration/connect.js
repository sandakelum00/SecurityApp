const mongoose = require("mongoose");

const connectBD = (url) => {
  return mongoose.connect(url);
};

module.exports = connectBD;

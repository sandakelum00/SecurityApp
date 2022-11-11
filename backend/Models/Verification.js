const mongoose = require("mongoose");

const VerificationSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },

  verify: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    expiresIn: 3600,
    default: Date.now(),
  },
});

module.exports = mongoose.model("VerificationAccount", VerificationSchema);

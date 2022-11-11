const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please provide user name"],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
    unique: true,
  },

  password: {
    type: String,
    minlength: 3,
    select: false,
    required: [true, "Please provide  password"],
  },

  accountType: {
    type: String,
    enum: ["Workers", "Managers", "Admin"],
    default: "Workers",
  },

  verify: {
    type: Boolean,
    default: false,
  },

  status: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);

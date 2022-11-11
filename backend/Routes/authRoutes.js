const express = require("express");
const router = express.Router();
const authenticateUser = require("../Middlewares/auth.js");

const {
  addUser,
  verifyEmail,
  login,
  resetUser,
} = require("../Controllers/authController.js");

router.route("/add-user").post(addUser);
router.route("/verify/:id").post(verifyEmail);
router.route("/login").post(login);
router.route("/reset-user").patch(resetUser);
// router.route("/").get(authenticateUser, getAllUser);

module.exports = router;

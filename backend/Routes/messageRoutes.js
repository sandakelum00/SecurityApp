const express = require("express");
const router = express.Router();

const {
  insertMessage,
  getAllMessages,
} = require("../Controllers/messageController.js");

router.route("/").post(insertMessage).get(getAllMessages);

module.exports = router;

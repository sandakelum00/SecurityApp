const express = require("express");
const router = express.Router();
const authenticateUser = require("../Middlewares/auth.js");
const upload = multer({ dest: "uploads" })

const {
    fileUpload
} = require("../Controllers/fileController");

router.route("/upload", upload.single("file")).post( fileUpload);

module.exports = router;
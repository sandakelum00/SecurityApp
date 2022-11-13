const express = require("express");
const router = express.Router();
const authenticateUser = require("../Middlewares/auth.js");
const {upload} = require("../Helpers/fileHelper.js");




const {
    fileUpload,
    downloadDoc,
} = require("../Controllers/fileController");

//router.route("/upload", upload.single("file")).post( fileUpload);
router.route("/upload").post(upload.single("file"),fileUpload);
router.route("/:id").get(downloadDoc);
module.exports = router;
const express = require("express");
const router = express.Router();
const authenticateUser = require("../Middlewares/auth.js");
const {upload} = require("../Helpers/fileHelper.js");




const {
    fileUpload,
    getAllDoc,
    downloadDoc,
} = require("../Controllers/fileController");

//router.route("/upload", upload.single("file")).post( fileUpload);
router.route("/upload").post(upload.single("file"),fileUpload).get(getAllDoc);
router.route("/:id").get(downloadDoc);
module.exports = router;
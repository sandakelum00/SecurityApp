const File = require("../Models/File")

const fileUpload = async (req, res, next) => {
    const fileData = {
      path: req.file.path,
      originalName: req.file.originalname,
    }
    if (req.body.password != null && req.body.password !== "") {
      fileData.password = await bcrypt.hash(req.body.password, 10)
    }
  
    const file = await File.create(fileData)
  
    res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` })
  };

  module.exports = { fileUpload };
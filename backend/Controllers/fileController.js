const File = require("../Models/File")
const path = require("path");


const asyncHandler = require("express-async-handler");


const fileUpload = async(req,res,next)=>{

  try{

    const fileData = new File({
      path:req.file.path,
      mimetype : req.file.mimetype,

    });

    const doc = await fileData.save();

    res.status(201).json({doc});
  }catch(error){
      next(error);
  }
};

const downloadDoc = async(req,res,next)=>{
  try{
    const {id: docId} = req.params;
  
    const file = await File.findOne({_id: docId});

    if(!file){
       res.status(400).json({ message: "Error file not found" });
        throw new Error("Error");
    }

    res.set({
      "Content-Type" : file.mimetype,
    });

    res.sendFile(path.join(__dirname,"..",file.path));
  }catch(error){
    next(error);
  }
}
// const bcrypt = require("bcrypt");


// const fileUpload = async (req, res, next) => {
//     const fileData = {
//       path: req.file.path,
//       originalName: req.file.originalname,
//     }
//     if (req.body.password != null && req.body.password !== "") {
//       fileData.password = await bcrypt.hash(req.body.password, 10)
//     }
  
//     const file = await File.create(fileData)
  
//     res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` })
//   };

  module.exports = { fileUpload,downloadDoc };
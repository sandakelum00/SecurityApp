const multer = require("multer");

const storage = multer.diskStorage({

    destination: (req,file,cb)=>{
        cb(null,"uploads");
    },

    filename:(req,file,cb)=>{
        cb(null,
            new Date().toISOString().replace(/:/g, "-"+file.originalname));
    },
});

const filefilter = (req, file, cb) => {
  if (
    !file.originalname.match(/\.(jpeg|jpg|png|pptx|pdf|doc|docx|xlsx|xls)$/)
  ) {
    return cb(
      new Error(
        "only upload files with jpg, jpeg, png,pptx,ppt, pdf, doc, docx, xslx, xls format."
      )
    );
  }
  cb(undefined, true);
};

const upload = multer({ storage: storage, fileFilter: filefilter });
module.exports = { upload };
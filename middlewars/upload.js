const path = require("path");
const multer = require("multer");

const uploadPath = path.resolve("tmp");
// console.log(uploadPath);

const storage = multer.diskStorage({
  destination: uploadPath,

  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}_${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

module.exports = upload;

// const multer = require("multer");
// const { v4: uuidv4 } = require("uuid");

// const MIME_TYPE_MAP = {
//   "image/png": "png",
//   "image/jpg": "jpg",
//   "image/jpeg": "jpg",
//   "image/svg+xml": "svg",
// };

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // console.log(file);
//     cb(null, "uploads/images");
//   },
//   filename: (req, file, cb) => {
//     const ext = MIME_TYPE_MAP[file.mimetype];
//     cb(null, uuidv4() + "." + ext);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype == "image/svg+xml" ||
//     file.mimetype == "image/jpeg" ||
//     file.mimetype == "image/jpg" ||
//     file.mimetype == "image/png"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

// module.exports = upload;

const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/svg+xml": "svg",
};

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ChatifyData/profiles", // Nested folder for better organization
    allowed_formats: ["jpg", "jpeg", "png", "svg"],
    public_id: (req, file) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      return `${uuidv4()}-${Date.now()}.${ext}`;
    },
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/svg+xml" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/png"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PNG, JPG, JPEG, and SVG files are allowed."
      ),
      false
    );
  }
};

// Export the configured multer instance directly
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;

// const express = require("express");
// const {
//   postSignup,
//   checkUsername,
//   postLogin,
//   updateProfile,
// } = require("../Controllers/user");
// const isAuth = require("../middleware/isAuth");
// const router = express.Router();

// const upload = require("../middleware/fileUpload");

// router.post("/signup", postSignup);
// router.post("/checkusername", checkUsername);
// router.post("/login", postLogin);
// router.put("/updateprofile", isAuth, upload.single("image"), updateProfile);

// module.exports = router;

const express = require("express");
const {
  postSignup,
  checkUsername,
  postLogin,
  updateProfile,
} = require("../Controllers/user");
const isAuth = require("../middleware/isAuth");
const upload = require("../middleware/fileUpload");
const router = express.Router();

router.post("/signup", postSignup);
router.post("/checkusername", checkUsername);
router.post("/login", postLogin);
router.put("/updateprofile", isAuth, upload.single("image"), updateProfile);

module.exports = router;

const express = require("express");
const { postSignup, checkUsername, postLogin } = require("../Controllers/user");
const router = express.Router();

router.post("/signup", postSignup);
router.post("/checkusername", checkUsername);
router.post("/login", postLogin);

module.exports = router;

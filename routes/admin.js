const express = require("express");
const isAuth = require("../middleware/isAuth");

const {
  getAllChats,
  getData,
  sendMessage,
  getUserChats,
} = require("../Controllers/admin");
const router = express.Router();

router.get("/get/allchats", isAuth, getAllChats);
router.get("/get/data", isAuth, getData);
router.post("/sendmessage/:id", isAuth, sendMessage);
router.get("/getuserchats", isAuth, getUserChats);

module.exports = router;

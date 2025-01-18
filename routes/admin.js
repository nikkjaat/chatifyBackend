const express = require("express");
const isAuth = require("../middleware/isAuth");

const {
  getAllChats,
  getData,
  sendMessage,
  getUserChats,
  getLoginUserData,
  getOnlineUsers,
} = require("../Controllers/admin");
const router = express.Router();

router.get("/get/allchats", getAllChats);
router.get("/get/data", isAuth, getData);
router.post("/sendmessage/:id", isAuth, sendMessage);
router.get("/getuserchats", isAuth, getUserChats);
router.get("/getmydata", isAuth, getLoginUserData);
router.get("/get/onlineusers", isAuth, getOnlineUsers);

module.exports = router;

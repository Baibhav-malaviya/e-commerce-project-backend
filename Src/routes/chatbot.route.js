const { Router } = require("express");
const { runChat } = require("../controllers/chatBot.controller");

const router = Router();

router.route("/").post(runChat);

module.exports = router;

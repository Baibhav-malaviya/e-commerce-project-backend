const { Router } = require("express");
const { runChat } = require("../controllers/chatBot.controller");

const router = Router();

router.route("/").get(runChat);

module.exports = router;

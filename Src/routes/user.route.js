const { Router } = require("express");

const router = Router();

router.route("/").get((req, res) => {
    return res.status(200).json({ message: "ok from user", data: { user: 1 } });
});

module.exports = router;

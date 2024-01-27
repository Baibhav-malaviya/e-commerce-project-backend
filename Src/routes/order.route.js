const { Router } = require("express");

const router = Router();

router.route("/").get((req, res) => {
    return res
        .status(200)
        .json({ message: "OK from order", data: { order: 1 } });
});

module.exports = router;

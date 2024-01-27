const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
    return res
        .status(200)
        .json({ message: "hello from auth", data: { status: 200 } });
});

router.route("/login").get((req, res) => {
    return res
        .status(200)
        .json({ message: "login from auth", data: { status: 200 } });
});

module.exports = router;

const { Router } = require("express");

const router = Router();

router.route("/").get((req, res) => {
    return res
        .status(200)
        .json({ message: "okay from cart", data: { cart: 1 } });
});

module.exports = router;

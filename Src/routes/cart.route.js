const { Router } = require("express");
const { verifyJWT } = require("../middleware/Auth.middleware");

const {
    addToCart,
    getCart,
    deleteFromCart,
} = require("../controllers/cart.controller");

const router = Router();
router.use(verifyJWT);

router.route("/").get(getCart);

router.route("/add/:productId").post(addToCart);

router.route("/remove/:productId").delete(deleteFromCart);

module.exports = router;

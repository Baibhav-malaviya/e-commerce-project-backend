const { Router } = require("express");
const { verifyJWT } = require("../middleware/Auth.middleware");

const {
    addToCart,
    getCart,
    deleteFromCart,
} = require("../controllers/cart.controller");

const router = Router();

router.route("/").get(verifyJWT, getCart);

router.route("/add/:productId").post(verifyJWT, addToCart);

router.route("/remove/:productId").delete(verifyJWT, deleteFromCart);

module.exports = router;

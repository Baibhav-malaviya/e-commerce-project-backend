const { Router } = require("express");
const router = Router();

const { verifyJWT } = require("../middleware/Auth.middleware");
const {
    getOrder,
    createOrder,
    getOrderById,
    getCurrentOrder,
} = require("../controllers/order.controller");

router.use(verifyJWT);

router.route("/").post(createOrder).get(getOrder);

router.route("/current").get(getCurrentOrder);

router.route("/:orderId").get(getOrderById);

module.exports = router;

const { Router } = require("express");
const router = Router();
const { verifyJWT } = require("../middleware/Auth.middleware");

const {
    checkout,
    paymentVerification,
} = require("../controllers/payment.controller");

router.use(verifyJWT);
router.route("/checkout").post(checkout);
router.route("/paymentVerification").post(paymentVerification);

module.exports = router;

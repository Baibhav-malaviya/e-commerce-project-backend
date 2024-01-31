const { Router } = require("express");
const { verifyJWT } = require("../middleware/Auth.middleware");

const {
    getWishlist,
    addToWishlist,
    deleteFromWishlist,
} = require("../controllers/wishlist.controller");

const router = Router();
router.use(verifyJWT);

router.route("/").get(getWishlist);
router.route("/add/:productId").post(addToWishlist);
router.route("/delete/:productId").delete(deleteFromWishlist);

module.exports = router;

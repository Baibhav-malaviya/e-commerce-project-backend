const { Router } = require("express");
const router = Router();

const { verifyJWT } = require("../middleware/Auth.middleware");
const {
    addProduct,
    getAllProduct,
    getProductById,
    deleteProductById,
    getProductByQuery,
    getProductByCategory,
    getRelatedProduct,
    getMultiRelatedProducts,
} = require("../controllers/product.controller");
const { upload } = require("../middleware/multer.middleware");

router
    .route("/getMultiRelatedProducts")
    .get(verifyJWT, getMultiRelatedProducts);
router.route("/getRelatedProduct").get(verifyJWT, getRelatedProduct);
router.route("/searchByQuery").get(verifyJWT, getProductByQuery);
router.route("/searchByCategory").get(verifyJWT, getProductByCategory);

router
    .route("/")
    .post(verifyJWT, upload.single("productImage"), addProduct)
    .get(verifyJWT, getAllProduct);

router
    .route("/:id")
    .get(verifyJWT, getProductById)
    .delete(verifyJWT, deleteProductById);

module.exports = router;

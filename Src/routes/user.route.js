const { Router } = require("express");
const router = Router();

const { upload } = require("../middleware/multer.middleware");
const { verifyJWT } = require("../middleware/Auth.middleware");

const {
    signup,
    login,
    logout,
    getUser,
    updateProfileImage,
    updateAccountDetails,
} = require("../controllers/user.controller");

router.route("/signup").post(upload.single("profileImage"), signup);
router.route("/login").post(login);
router.route("/logout").get(verifyJWT, logout);
router.route("/me").get(verifyJWT, getUser);
router
    .route("/update/profileImage")
    .patch(verifyJWT, upload.single("profileImage"), updateProfileImage);
router.route("/update/accountDetails").patch(verifyJWT, updateAccountDetails);
router.route("/").get((req, res) => {
    return res.status(200).json({ message: "ok from user", data: { user: 1 } });
});

module.exports = router;

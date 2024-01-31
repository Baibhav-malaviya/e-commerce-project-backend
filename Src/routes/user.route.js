const { Router } = require("express");
const router = Router();

const { upload } = require("../middleware/multer.middleware");
const {
    signup,
    login,
    logout,
    getUser,
} = require("../controllers/user.controller");
const { verifyJWT } = require("../middleware/Auth.middleware");

router.route("/signup").post(upload.single("profileImage"), signup);
router.route("/login").post(login);
router.route("/logout").get(verifyJWT, logout);
router.route("/me").get(verifyJWT, getUser);
router.route("/").get((req, res) => {
    return res.status(200).json({ message: "ok from user", data: { user: 1 } });
});

module.exports = router;

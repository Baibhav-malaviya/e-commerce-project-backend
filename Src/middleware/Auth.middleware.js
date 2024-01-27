const User = require("../models/user.model");
const JWT = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        const decodedUser = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedUser._id).select(
            "-password -refreshToken"
        );

        if (!user) return res.status(403).json({ message: "Invalid token" });

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            message:
                error?.message + " user not logged in." ||
                "Something went wrong",
        });
    }
};

module.exports = { verifyJWT };

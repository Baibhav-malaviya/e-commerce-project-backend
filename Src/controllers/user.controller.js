const User = require("../models/user.model");
const {
    uploadOnCloudinary,
    deleteFromCloudinary,
} = require("../utils/cloudinary");

const signup = async (req, res) => {
    const { userName, fullName, email, phone, password } = req.body;
    if (!userName || !fullName || !email || !phone || !password)
        return res.status(403).json({ message: "Every field is required." });

    const existedUser = await User.findOne({
        $or: [{ email }, { phone }, { userName }],
    });

    if (existedUser)
        return res.status(403).json({
            message: `User with email: ${email} or phone: ${phone} already exists`,
        });

    const profileImageLocalPath = req.file?.path;

    if (!profileImageLocalPath)
        return res
            .status(403)
            .json({ message: "Error in finding the local path" });

    const profileImage = await uploadOnCloudinary(profileImageLocalPath);

    if (!profileImage)
        return res
            .status(403)
            .json({ message: "Error in uploading the image" });

    const user = await User.create({
        userName,
        fullName,
        email,
        password,
        phone,
        profileImage: profileImage?.url || "",
    });

    const createdUser = await User.findById(user._id).select("-password");

    return res
        .status(200)
        .json({ message: "user created successfully", data: createdUser });
};

const login = async (req, res) => {
    const { email, userName, phone, password } = req.body;

    if ((!email && !userName && !phone) || !password) {
        return res.status(403).json({ message: "Required fields are not set" });
    }

    const user = await User.findOne({
        $or: [{ email }, { phone }, { userName }],
    });

    if (!user)
        return res
            .status(404)
            .json({ message: "User with this data is not found" });

    const isValidUser = await user.isPasswordCorrect(password);

    if (!isValidUser)
        return res
            .status(404)
            .json({ message: "password is not matched with above data" });

    const loggedInUser = await User.findById(user._id).select("-password");

    const accessToken = loggedInUser.generateAccessToken();

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json({ message: "user logged in successfully", data: loggedInUser });
};

const logout = async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json({ message: "logout successfully" });
};

const getUser = async (req, res) => {
    return res
        .status(200)
        .json({ message: "User details fetched successfully", data: req.user });
};

const updateProfileImage = async (req, res) => {
    const { _id: userId, profileImage: profileImageUrl } = req.user;
    const profileImageLocalPath = req.file?.path;

    if (!profileImageLocalPath)
        return res.status(403).json({ message: "Error in uploading locally." });

    const profileImage = await uploadOnCloudinary(profileImageLocalPath);

    if (!profileImage || !profileImage.url)
        return res
            .status(403)
            .json({ message: "Error uploading image to Cloudinary." });

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profileImage: profileImage?.url || "" },
        { new: true } // To return the updated document
    );

    //delete the prev profile image from cloudinary
    await deleteFromCloudinary(profileImageUrl);

    return res.status(200).json({
        message: "ProfileImage updated successfully",
        data: updatedUser,
    });
};

const updateAccountDetails = async (req, res) => {
    const { fullName, email, userName, phone } = req.body;

    if (!fullName && !email && !userName && !phone) {
        return res.status(403).json({ message: "Anyone of then is required" });
    }

    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (email) updateFields.email = email;
    if (userName) updateFields.userName = userName;
    if (phone) updateFields.phone = phone;

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: updateFields,
        },
        { new: true }
    ).select(" -password");

    return res
        .status(200)
        .json({ message: "User updated successfully", data: updatedUser });
};

module.exports = {
    signup,
    login,
    logout,
    getUser,
    updateProfileImage,
    updateAccountDetails,
};

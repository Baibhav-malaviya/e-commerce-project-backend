const { Types } = require("mongoose");
const Wishlist = require("../models/wishlist.model");

const getWishlist = async (req, res) => {
    const userId = req.user._id;

    // const wishlist = await Wishlist.find({ user: userId });
    const wishlist = await Wishlist.aggregate([
        {
            $match: { user: new Types.ObjectId(userId) },
        },
        {
            $lookup: {
                from: "fashionhubproducts",
                localField: "items.product",
                foreignField: "_id",
                as: "items",
            },
        },
    ]);

    return res
        .status(200)
        .json({ message: "wishlist fetched successfully", data: wishlist });
};

const addToWishlist = async (req, res) => {
    const userId = req.user._id;
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!productId)
        return res.status(403).json({ message: "Product id must be provided" });

    if (!quantity)
        return res.status(403).json({ message: "Quantity not specified" });

    const newItem = {
        product: productId,
        quantity: quantity,
    };

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        await Wishlist.create({
            user: userId,
            items: [newItem],
        });

        return res.status(200).json({
            message: "wishlist created and new item added successfully",
            data: newItem,
        });
    }

    const isAlreadyAdded = wishlist.items.some(
        (item) => item.product.toString() == productId
    );

    if (isAlreadyAdded)
        return res
            .status(403)
            .json({ message: "Already added to the wishlist" });

    await wishlist.items.push(newItem);
    await wishlist.save();

    return res
        .status(200)
        .json({ message: "new item added successfully", data: newItem });
};

const deleteFromWishlist = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist)
        return res.status(404).json({ message: "wishlist not found" });

    const updatedWishlist = await Wishlist.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { product: productId } } },
        { new: true }
    );

    return res
        .status(200)
        .json({ message: "item deleted successfully", data: updatedWishlist });
};

module.exports = { getWishlist, addToWishlist, deleteFromWishlist };

const { Types } = require("mongoose");
const Cart = require("../models/cart.model");

const addToCart = async (req, res) => {
    const user = req.user;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!productId)
        return res.status(403).json({ message: "Product id must be provided" });

    if (!quantity)
        return res.status(403).json({ message: "Quantity not specified" });

    const newItem = {
        product: productId,
        quantity: quantity,
    };

    const cart = await Cart.findOne({ user: user._id });

    const isAlreadyAdded = cart.items.some(
        (item) => item.product.toString() === productId
    );

    if (isAlreadyAdded)
        return res
            .status(403)
            .json({ message: "Product is already in the cart" });

    if (cart) {
        await cart.items.push(newItem);
        await cart.save();

        return res
            .status(200)
            .json({ message: "Item added successfully", data: newItem });
    } else {
        await Cart.create({
            user: user._id,
            items: [newItem],
        });
        return res.status(200).json({
            message: "Cart created and item added successfully",
            data: newItem,
        });
    }
};

const getCart = async (req, res) => {
    const user = req.user;

    if (!user)
        return res.status(403).json({ message: "You must be logged in." });

    // const carts = await Cart.find({ user: user._id });
    const carts = await Cart.aggregate([
        {
            $match: { user: new Types.ObjectId(user._id) },
        },
        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "items",
            },
        },
    ]);

    return res
        .status(403)
        .json({ message: "Carts fetched successfully.", data: carts });
};

const deleteFromCart = async (req, res) => {
    const user = req.user;
    const { productId } = req.params;

    if (!user)
        return res.status(403).json({ message: "You must be logged in." });

    if (!productId)
        return res.status(403).json({ message: "Product id must be provided" });

    const updatedCart = await Cart.findOneAndUpdate(
        { user: user._id },
        { $pull: { items: { product: productId } } },
        { new: true }
    );

    return res
        .status(200)
        .json({ message: "Item removed successfully", updatedCart });
};

module.exports = { addToCart, getCart, deleteFromCart };

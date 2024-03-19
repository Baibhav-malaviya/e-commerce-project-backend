const Order = require("../models/order.model");
const User = require("../models/user.model");
const { Types } = require("mongoose");
const sendEmail = require("../utils/nodeMailer");

const createOrder = async (req, res) => {
    const userId = req.user._id;
    const { products, shippingAddress } = req.body;
    // products format: [{id, quantity, price },...]

    if (!Array.isArray(products) || products.length === 0 || !shippingAddress) {
        return res.status(400).json({
            message:
                "Invalid or empty product list or shippingAddress provided",
        });
    }

    const orders = [];

    for (const product of products) {
        const { id: productId, quantity, price } = product;

        const order = await Order.create({
            user: userId,
            product: productId,
            quantity,
            price,
            shippingAddress,
        });

        orders.push(order);
    }

    if (orders.length === 0)
        return res
            .status(403)
            .json({ message: "Something wrong in ordering the product" });

    const { email: currentUserMail } = await User.findById();
    sendEmail(currentUserMail, "Order created successfully");

    return res
        .status(200)
        .json({ message: "Order created successfully", data: orders });
};
const getOrder = async (req, res) => {
    const userId = req.user._id;
    if (!userId) return res.status(403).json({ message: "User not logged in" });

    // const orders = await Order.find({ user: userId });
    const orders = await Order.aggregate([
        {
            $match: { user: new Types.ObjectId(userId) },
        },
        {
            $lookup: {
                from: "fashionhubproducts",
                localField: "product",
                foreignField: "_id",
                as: "product",
            },
        },
        {
            $addFields: {
                product: { $arrayElemAt: ["$product", 0] },
            },
        },
    ]);

    return res
        .status(200)
        .json({ message: "All the order fetched successfully", data: orders });
};

const getOrderById = async (req, res) => {
    // orderId: 65b7793ac8f3552c21e09631

    const { orderId } = req.params;

    if (!orderId)
        return res.status(403).json({ message: "Order id not found" });

    // const order = await Order.findById(orderId);
    const order = await Order.aggregate([
        { $match: { _id: new Types.ObjectId(orderId) } },
        {
            $lookup: {
                from: "fashionhubproducts",
                localField: "product",
                foreignField: "_id",
                as: "product",
            },
        },
        {
            $addFields: {
                product: { $arrayElemAt: ["$product", 0] },
            },
        },
    ]);

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res
        .status(200)
        .json({ message: "Order fetched successfully", data: order });
};

const getCurrentOrder = async (req, res) => {
    const userId = req.user._id;

    // const currentOrders = await Order.find({
    //     user: userId,
    //     orderStatus: { $nin: ["delivered", "cancelled"] },
    // });

    const currentOrders = await Order.aggregate([
        {
            $match: {
                user: new Types.ObjectId(userId),
                orderStatus: { $nin: ["delivered", "cancelled"] },
            },
        },
        {
            $lookup: {
                from: "fashionhubproducts",
                localField: "product",
                foreignField: "_id",
                as: "product",
            },
        },
        {
            $addFields: {
                product: { $arrayElemAt: ["$product", 0] },
            },
        },
    ]);

    if (!currentOrders)
        return res
            .status(404)
            .json({ message: "Error in finding the current order" });

    return res.status(200).json({
        message: "Current order fetched successfully",
        data: currentOrders,
    });
};

module.exports = { getOrder, createOrder, getOrderById, getCurrentOrder };

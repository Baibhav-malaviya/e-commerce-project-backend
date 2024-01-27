const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        shippingAddress: {
            type: String,
            required: true,
        },
        orderStatus: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Order = model("Order", orderSchema);

module.exports = Order;

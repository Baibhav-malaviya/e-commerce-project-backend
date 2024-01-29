const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
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

//? This is the orderSchema in which in a single order there are multiple products, then there are problems in tracking a particular products or in fetching the info of a particular product.
// const orderSchema = new Schema(
//     {
//         user: {
//             type: Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },
//         products: [
//             {
//                 product: {
//                     type: Schema.Types.ObjectId,
//                     ref: "Product",
//                     required: true,
//                 },
//                 quantity: {
//                     type: Number,
//                     required: true,
//                     min: 1,
//                 },
//             },
//         ],
//         totalPrice: {
//             type: Number,
//             required: true,
//             min: 0,
//         },
//         shippingAddress: {
//             type: String,
//             required: true,
//         },
//         orderStatus: {
//             type: String,
//             enum: [
//                 "pending",
//                 "processing",
//                 "shipped",
//                 "delivered",
//                 "cancelled",
//             ],
//             default: "pending",
//         },
//     },
//     { timestamps: true }
// );

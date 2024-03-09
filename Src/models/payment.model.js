const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["created", "captured", "refunded", "failed"],
            default: "created",
        },
        razorpayPaymentId: {
            type: String,
            required: true,
        },
        razorpayOrderId: {
            type: String,
            required: true,
        },
        // Add more fields as needed
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;

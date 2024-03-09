const Razorpay = require("razorpay");
const Payment = require("../models/payment.model");

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

const checkout = async (req, res) => {
    try {
        const amount = req.body.amount;
        var options = {
            amount: Number(amount) * 100, // amount in the smallest currency unit
            currency: "INR",
        };
        const order = await instance.orders.create(options);
        return res.status(200).json({ message: "checkout", data: order });
    } catch (error) {
        console.log("Error in checkout function: ", error);
    }
};

const paymentVerification = async (req, res) => {
    console.log(req.body);
    return res.redirect("localhost:5173/cart");
    return res.status(200).json({ message: "payment verification" });
};

module.exports = { checkout, paymentVerification };

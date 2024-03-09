const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(
    cors({
        // origin: process.env.CORS_ORIGIN,
        origin: "http://localhost:5173",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true, // Enable cookies and other credentials to be included in CORS requests
    })
);

app.use(express.json({ limit: "16kb" })); // Maximum request body size
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //extended: true because it use modern qs library to encode and decode the form data
app.use(express.static("public")); // for serving the static files
app.use(cookieParser());

const authRouter = require("./routes/auth.route");
const productRouter = require("./routes/product.route");
const cartRouter = require("./routes/cart.route");
const orderRouter = require("./routes/order.route");
const userRouter = require("./routes/user.route");
const wishListRouter = require("./routes/wishlist.route");
const paymentRouter = require("./routes/payment.route");

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/user", userRouter);
app.use("/api/wishlist", wishListRouter);
app.use("/api/payment", paymentRouter);

module.exports = { app };

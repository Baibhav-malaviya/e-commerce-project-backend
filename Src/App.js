const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true, // Enable cookies and other credentials to be included in CORS requests
    })
);

app.use(express.json({ limit: "16kb" })); // Maximum request body size
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //extended: true because it use modern qs library to encode and decode the form data
app.use(express.static("public")); // for serving the static files
app.use(cookieParser());

module.exports = { app };

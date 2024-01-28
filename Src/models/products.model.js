const { Schema, model } = require("mongoose");

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            required: true,
        },
        tags: {
            type: [String], // Array of strings for multiple tags
            default: [],
        },
        productImage: {
            type: String,
            required: true,
        },
        ratings: {
            type: Number,
            min: 0,
            max: 5,
        },
        reviews: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
                rating: {
                    type: Number,
                    min: 1,
                    max: 5,
                },
                comment: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Product = model("Product", productSchema);

module.exports = Product;

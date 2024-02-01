const { Schema, model } = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const wishlistItemSchema = new Schema({
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
});

const wishlistSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [wishlistItemSchema],
    },
    {
        timestamps: true,
    }
);

wishlistSchema.plugin(aggregatePaginate);

const Wishlist = model("Wishlist", wishlistSchema);

module.exports = Wishlist;

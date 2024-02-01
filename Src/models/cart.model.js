const { Schema, model } = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const cartItemSchema = new Schema({
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

const cartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [cartItemSchema],
    },
    {
        timestamps: true,
    }
);

cartSchema.plugin(aggregatePaginate);

const Cart = model("Cart", cartSchema);

module.exports = Cart;

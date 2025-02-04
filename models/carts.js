const mongoose = require("mongoose");

//sous-document
const cartItemSchema = mongoose.Schema({
  quantity: Number,
  article: { type: mongoose.Schema.Types.ObjectId, ref: "articles" },
});

//schema
const cartSchema = mongoose.Schema({
  items: [cartItemSchema],
});

const Cart = mongoose.model("carts", cartSchema);

module.exports = Cart;

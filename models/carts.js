const mongoose = require("mongoose");

//sous-document
const cartItemSchema = mongoose.Schema({
  size: String, 
  color: String,
  quantity: Number,
  article: { type: mongoose.Schema.Types.ObjectId, ref: "articles" },
});

//schema
const cartSchema = mongoose.Schema({
  items: [cartItemSchema],
  ownerOfCart: { type: mongoose.Schema.Types.String, ref: 'users' },
});

const Cart = mongoose.model("carts", cartSchema);

module.exports = Cart;

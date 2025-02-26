const mongoose = require("mongoose");

//sous-document
const cartItemSchema = mongoose.Schema({
 
  quantity: Number,
  size : String,
  giSize : String,
  color : String,
  price: String,
  article: { type: mongoose.Schema.Types.ObjectId, ref: "articles" },
});

//schema
const cartSchema = mongoose.Schema({
  items: [cartItemSchema],
  ownerOfCart: { type: mongoose.Schema.Types.String, ref: 'users' },
});

const Cart = mongoose.model("carts", cartSchema);

module.exports = Cart;

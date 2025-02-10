const mongoose = require("mongoose");

const itemsSchema = mongoose.Schema({
  quantity: Number,
  article: String,
  totalPayed: Number,
});


const orderSchema = mongoose.Schema({
  items: [itemsSchema],
  address: String,
  date: Date,
  delivery: {type: String, enum: ["Purchased", "Shipped", "Delivered"], default: "Purchased"},
  ownerOfCart: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
});

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;

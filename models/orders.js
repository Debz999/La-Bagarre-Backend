const mongoose = require("mongoose");

const itemsSchema = mongoose.Schema({
 
    quantity: Number,
    size : String,
    giSize : String,
    color : String,
    price : String,
    article: { type: mongoose.Schema.Types.ObjectId, ref: "articles" },

});


const orderSchema = mongoose.Schema({
  items: [itemsSchema],
  address: String,
  date: {
    type: Date,
    required: true,
  },
  delivery: {type: String, enum: ["Purchased", "Shipped", "Delivered"], default: "Purchased"},
  ownerOfOrders: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
});

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;

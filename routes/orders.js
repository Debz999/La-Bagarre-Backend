var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Order = require("../models/orders");
const User = require("../models/users");
const Cart = require("../models/carts");
const Article = require("../models/articles");

// /*Get all orders, to test */
// router.get("/", function (req, res, next) {
//   Order.find().then((data) => {
//     console.log(data);
//     res.json({ data });
//   });
// });

/* POST  orders*/
//récuperer le contenu du cart via user.token récup le cart
// depuis le front adresse, token
//save le tout puis vider le cart

router.post("/post/:token", (req, res) => {
  console.log('routeorder', req.body.article)
  User.findOne({ token: req.params.token }).then((user) => {
    Cart.findOne({ ownerOfCart: user._id })
      .then((data) => {
        const orderItems = data.items.map((item) => ({
          size: item.size,
          giSize: item.giSize,
          color: item.color,
          quantity: item.quantity,
          article: item.article,
          price: item.price,
          
        }));
        const order = new Order({
          address: req.body.address,
          //address: (user.address[0]), //gisela changed it to save the address from front
          date: new Date(),
          delivery: "Purchased",
          ownerOfOrders: user._id,
          items: orderItems,
        });
        //gisela added the next three lines
        order.save().then(() => {
          res.json({ message: "order saved successfully", order: order });
        });

      })
      .then(() => {
        // Clear the cart after creating the order
        return Cart.findOneAndUpdate(
          { ownerOfCart: user._id },
          { $set: { items: [] } },
          { new: true }
        );
      });
  });
});

/* GET user orders.  */

router.get("/:token", function (req, res, next) {
  User.findOne({ token: req.params.token }).then((user) => {
    Order.find({ ownerOfOrders: user._id })
      .populate("items.article")
      .then((orders) => {
        res.json({ data: orders });
      });
  });
});

/*PUT order status */
//to do later
// router.put("/put/:orderId", (req, res) => {

// });

module.exports = router;

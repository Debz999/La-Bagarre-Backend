var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Order = require("../models/orders");
const User = require("../models/users");
const Cart = require('../models/carts')

/*Get all orders, to test */
router.get("/", function (req, res, next) {
  Order.find().then((data) => {
    console.log(data);
    res.json({ data });
  });
});

/* GET user orders.  */
//returns null, i'll check why later
router.get("/:token", function (req, res, next) {
  User.find({ token: req.params.token }).then((user) => {
    console.log(user);
    Order.findOne({ ownerOfOrders: user._id }).then((data) => {
      console.log(data);
      res.json({ data });
    });
  });
});

/* POST  orders*/
//récuperer le contenu du cart via user.token récup le cart => populate = liste article et prix
// depuis le front adresse, token
//save le tout puis vider le cart

router.post("/post/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    Cart.findOne({ ownerOfCart: data._id })
      .populate("items.article")
      .then((data) => {
        res.json({ data });
      });
  });
});

/*PUT order status */
//to do later
// router.put("/put/:orderId", (req, res) => {

// });

module.exports = router;

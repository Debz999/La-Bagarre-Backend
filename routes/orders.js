var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Order = require("../models/orders");
const User = require("../models/users");

/* GET user orders.  */
//Get user via token, populate orders
router.get("/orders/:token", function (req, res, next) {
  User.findOne({ token: req.params.token })
    .populate("orders")
    .then((data) => {
      console.log(data);
      res.json({ data });
    });
});

/* POST  orders*/
router.post("/orders/post/:token", (req, res) => {
  const { quantity, article, totalPayed, address, date, delivery } = req.body;

  if (!checkBody(req.body[("address", "date", "delivery")])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  } else {
    
    function createNewOrder(user) {
      const newOrder = new Order({
        items: {
          quantity,
          article,
          totalPayed,
        },
        address,
        date,
        delivery,
        ownerOfOrders: user._id,
      });
      newOrder.save().then((data) => {
        res.json({ result: true, newOrder: data });
      });
    };

    //create edit order function here



    User.findOne({ token: req.params.token }).then((user) => {
      console.log(user);
      Order.findOne({ ownerOfOrders: user._id }).then((orderFromDB) => {
        if (!orderFromDB) {
          createNewOrder(user);
        } else {
          //create an edit order each time the user orders something new
          //editCart(user);
        }
      });
    });
  }
});

module.exports = router;

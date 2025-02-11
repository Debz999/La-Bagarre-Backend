var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const Order = require("../models/orders");
const User = require("../models/users");


/*Get all orders, to test */
router.get("/", function (req, res, next) {
  Order.find()
    .then((data) => {
      console.log(data);
      res.json({ data });
    });
});

/* GET user orders.  */
//returns null, i'll check why later
router.get("/:token", function (req, res, next) {
  User.find({token: req.params.token})
  .then((user) => {
    console.log(user);
    Order.findOne({ ownerOfOrders: user._id })
      .then((data) => {
        console.log(data);
        res.json({ data });
      });
  })
});

/* POST  orders*/
router.post("/post/:token", (req, res) => {
  const { address, date, delivery, quantity, article, totalPayed } = req.body;

  if (!checkBody(req.body, ["address", "date", "delivery", "article", "quantity", "totalPayed"])) {
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

    User.findOne({ token: req.params.token }).then((user) => {
      console.log(user);
      Order.findOne({ ownerOfOrders: user._id }).then((orderFromDB) => {
        if (!orderFromDB) {
          createNewOrder(user);
        } else {
          //create an edit order each time the user orders something new
          //editOrderStatus(user);
          console.log('not sure what');
        }
      });
    });
  }
});

/*PUT order status */ 
//to do later
// router.put("/put/:orderId", (req, res) => {


// });


module.exports = router;

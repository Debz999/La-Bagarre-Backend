var express = require("express");
var router = express.Router();

const Cart = require("../models/carts");

/* GET all carts. */
router.get("/", function (req, res, next) {
  Cart.find().then((data) => {
    console.log(data);
    res.json({ data });
  });
});

/* POST  new cart*/
router.post("/post/:_id", (req, res) => {
  const newItem = new Cart({
    items: [{ 
      quantity: req.body.number, 
      article: req.params.article 
  }],
  });
  newItem.save().then(() => {
    Articles.findOne({ _id: newItem._id })
      .populate("article")
      .then((data) => {
        console.log(data); //it finds everything
        res.json({ result: true, newItem: data });
      });
  });
});

/* DELETE   item from cart using the name*/
router.delete("/:_id", (req, res) => {
  Cart.deleteOne({ title: { $regex: new RegExp(req.params._id, "i") } }).then(
    (data) => {
      if (data.deletedCount > 0) {
        Cart.find().then((data) => {
          console.log(data.deletedCount);
          res.json({
            result: true,
            updatedCart: data,
            answer: "item has been successfully deleted",
          });
        });
      } else {
        console.log(data);
        console.log(req.params.name);
        res.json({
          result: false,
          fullCart: data,
          error: "no item was found with this title",
        });
      }
    }
  );
});

module.exports = router;

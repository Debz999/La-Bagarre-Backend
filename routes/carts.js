var express = require("express");
var router = express.Router();

const Cart = require("../models/carts");
const Article = require("../models/articles")

/* GET all carts. */
router.get("/", function (req, res, next) {
  Cart.find().populate("items.article").then((data) => {
    console.log(data);
    res.json({ data });
  });
});

/* POST  new cart*/
//ERROR - ARTICLE NOT POPULATING
router.post("/post", (req, res) => {
  if(!req.body._id || !req.body.quantity) {
    res.json({result: false, error: 'missing information'})
  } else {
    const newItem = new Cart({
      items: [{
        quantity: req.body.quantity,
        article: req.body._id
      }]
    });
    newItem.save().then(() => {
      Cart.findById(newItem._id)
      .populate("items")
      .then((data) => {
        console.log(data);
        res.json({result: true, newItem: data})
      })
    })
  }
});


/* DELETE   item from cart using the name*/
router.delete("/:_id", (req, res) => {
  Cart.deleteOne({_id: req.params._id}).then((data) => {
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
      console.log(req.params._id);
      res.json({
        result: false,
        fullCart: data,
        error: "no item was found with this title",
      });
    }
  })
})

module.exports = router;

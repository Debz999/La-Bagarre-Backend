var express = require("express");
var router = express.Router();

const Cart = require("../models/carts");
const Article = require("../models/articles");

//HERE INCLUDE USER ADDRESS TO ONLY GET THE PERTNENT CART
/* GET all carts. */
router.get("/", function (req, res, next) {
  Cart.find()
    .populate("items.article")
    .then((data) => {
      console.log(data);
      res.json({ data });
    });
});

/* GET user cart. */
router.get("/:_id", function (req, res, next) {
  Cart.findById(req.params._id)
    .populate("items.article")
    .then((data) => {
      console.log(data);
      res.json({ data });
    });
});

/* POST  new cart items*/
router.post("/post/:_id", (req, res) => {
  const userId = req.params._id;
  const articleId = req.body._id;
  const quantityNum = req.body.quantity;

  function createNewCart() {
    const newCart = new Cart({
      ownerOfCart: userId,
      items: [
        {
          quantity: req.body.quantity,
          article: req.body._id,
        },
      ],
    });
    newCart.save().then(() => {
      res.json({ result: true, message: "new Cart created" });
    });
  }

  function editCart() {
    Cart.findOne({ ownerOfCart: userId }).then((userCartDB) => {
      //Info userCartDB has items and ownerOfCart
      if (userCartDB.items.find((e) => e.article == articleId)) {
        //if articleId found, edit quantity
        for (let object of userCartDB.items) {
          //console.log('obj', object.article._id)
          if (String(object.article._id) === articleId) {
            object.quantity = quantityNum;
            //console.log('q', object.quantity)
          }
        }
      } else {
        //if articlId not found, add article
        userCartDB.items.push({ quantity: quantityNum, article: articleId });
      }
      userCartDB.save().then(() => {
        res.json({ result: true, message: "cart article added" });
      });
    });
  }
  Cart.findOne({ ownerOfCart: userId }).then((cartFromDB) => {
    if (!cartFromDB) {
      createNewCart();
    } else {
      editCart();
    }
  });
});

/* DELETE   item from cart using id*/
router.delete("/:_id", (req, res) => {
  const userId = req.params._id;
  const articleId = req.body._id;
  Cart.findOne({ ownerOfCart: userId })
    .then((cartFromDB) => {
      if (cartFromDB.items.find((e) => e.article == articleId)) {
        //console.log(cartFromDB);
        //filter would've worked too with cartFromDB.items = cartFromDB.items.filter...
        const index = cartFromDB.items.findIndex((e) => e.article == articleId);
        console.log("index", index);
        cartFromDB.items.splice(index, 1);
        console.log('working')
      } else {
       console.log('error')
      }
      cartFromDB.save().then(() => {
        res.json({ result: true, message: "cart article removed" });
    })
    });
});

//save it just in case i need to delete the entire cart
//  Cart.deleteOne({ 'items.article': articleId }).then((data) => {
//   if (data.deletedCount > 0) {
//     Cart.find().then((data) => {
//       console.log(data.deletedCount);
//       res.json({
//         result: true,
//         updatedCart: data,
//         answer: "item has been successfully deleted",
//       });
//     });
//   } else {
//     console.log(data);
//     console.log(articleId);
//     res.json({
//       result: false,
//       fullCart: data,
//       error: "no item was found with this id",
//     });
//   }
// });
module.exports = router;

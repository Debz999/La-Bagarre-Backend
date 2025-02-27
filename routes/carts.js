var express = require("express");
var router = express.Router();

const Cart = require("../models/carts");
const User = require("../models/users");

/* GET all carts. For testing purposes only, not secure */
router.get("/", function (req, res, next) {
  Cart.find()
    .populate("items.article")
    .then((data) => {
      console.log(data);
      res.json({ data });
    });
});

// router.get('/:token', function (req, res) {
// User.findOne({token: req.params.token})
// .then((data) => {
//   res.json({data});
// })
// })

/* GET user cart.  */
router.get("/:token", function (req, res, next) {
  User.findOne({ token: req.params.token }).then((data) => {
    console.log(data);
    Cart.findOne({ ownerOfCart: data._id })
      .populate("items.article")
      .then((data) => {
        console.log(data);
        res.json({ data });
      });
  });
});

/* POST  new cart items*/
router.post("/post/:token", (req, res) => {
  const articleId = req.body._id;
  const quantityNum = req.body.quantity;
  const {quantity, color, size, giSize, price} = req.body
  console.log('price',price)

  function createNewCart(user) {
    const newCart = new Cart({
      ownerOfCart: user._id,
      items: [
        {
          size: size,
          giSize : giSize,
          color: color,
          quantity: quantity,
          article: req.body._id,
          price : price,
        },
      ],
    });
    newCart.save().then(() => {
      res.json({ result: true, message: "new Cart created" });
    });
  }

  function editCart(user) {
    Cart.findOne({ ownerOfCart: user._id }).then((userCartDB) => {
      //Info userCartDB has items and ownerOfCart
      if (userCartDB.items.find((e) => e.article == articleId)) {
        //if articleId found, edit quantity
        for (let object of userCartDB.items) {
          //console.log('obj', object.article._id)
          if (String(object.article._id) === articleId) {
            object.quantity = quantity;

            //console.log('q', object.quantity)
          }
        }
      } else {
        //if articlId not found, add article
        userCartDB.items.push({size: size, color: color, quantity: quantity, article: articleId, price: price });
      }
      userCartDB.save().then(() => {
        res.json({ result: true, message: "cart article added" });
      });
    });
  }

  User.findOne({ token: req.params.token }).then((user) => {
    console.log(user);
    //res.json({user})
    Cart.findOne({ ownerOfCart: user._id }).then((cartFromDB) => {
      if (!cartFromDB) {
        createNewCart(user);
      } else {
        editCart(user);
      }
    });
  });
});

/* DELETE   item from cart using id*/ 

router.delete("/:token", (req, res) => {
  const articleId = req.body._id;
  User.findOne({ token: req.params.token }).then((user) => {
    console.log(user);
    Cart.findOne({ ownerOfCart: user._id }).then((cartFromDB) => {
      if (cartFromDB.items.find((e) => e.article == articleId)) {
        //console.log(cartFromDB);
        //filter would've worked too with cartFromDB.items = cartFromDB.items.filter...
        const index = cartFromDB.items.findIndex((e) => e.article == articleId);
        console.log("index", index);
        cartFromDB.items.splice(index, 1);
        console.log("working");
      } else {
        console.log("error");
      }
      cartFromDB.save().then(() => {
        res.json({ result: true, message: "cart article removed" });
      });
    });
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

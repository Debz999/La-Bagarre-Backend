var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hash,
        token: uid2(32),
        canBookmark: true,
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ username: req.body.username }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

/* Edit user to add the basic information */
router.put("/addinfo/:token", (req, res) => {
  const { email, firstname, lastname } = req.body;
  if (!checkBody(req.body, ["email", "firstname", "lastname"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.updateOne(
    { token: req.params.token },
    {
      $set: {
        email: email,
        firstname: firstname,
        lastname: lastname,
      },
    }
  ).then(() => {
    User.findOne({ token: req.params.token })
      .select("-password -_id")
      .then((data) => {
        console.log(data);
        res.json({ result: true, user: data });
      });
  });
});

/*Edit user to add a new address */
router.put("/newaddress/:token", (req, res) => {
  const { number, street, city, zipcode, country } = req.body;
  if (
    !checkBody(req.body, ["number", "street", "city", "zipcode", "country"])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ token: req.params.token }).then((userFromDB) => {
    userFromDB.address.push({
      number: number,
      street: street,
      city: city,
      zipcode: zipcode,
      country: country,
    });
    userFromDB.save().then(() => {
      User.findOne({ token: req.params.token })
        .select("-password -_id")
        .then((data) => {
          //console.log(data);
          res.json({ result: true, message: "new address added", data: data });
        });
    });
  });
});

/* GET user securely */
router.get("/:token", function (req, res, next) {
  User.findOne({ token: req.params.token })
    .select("-password -_id")
    .then((data) => {
      console.log(data);
      res.json({ data });
    });
});

/*EDIT user */
router.put("/editaddress/:token", (req, res) => {
  const addressId = req.body._id;
  //console.log("req body", req.body);

  User.findOne({ token: req.params.token }).then((userFromDB) => {
    const addressToEdit = userFromDB.address.find((e) => e._id == addressId);
    //console.log('a e',addressToEdit); //address ok
    if (addressToEdit) {
      for (let key in req.body) {
        console.log("key", key);
        if (req.body[key] && key !== "") {
          addressToEdit[key] = req.body[key];
        }
      }

      userFromDB.save().then(() => {
        User.findOne({ token: req.params.token })
          .select("-password -_id")
          .then((data) => {
            console.log(data);
            res.json({ result: true, message: "address edited", data: data });
          });
      });
    } else {
      res.json({ result: false, message: "nop" });
    }
  });
});

//DELETE user's address from DB
router.delete("/deleteaddress/:token", (req, res) => {
  const addressId = req.body._id;
  console.log("check del", req.body); //contains addressId: id
  User.findOne({ token: req.params.token }).then((userFromDB) => {
    console.log("user", userFromDB.address);
    if (userFromDB.address.find((e) => e._id == addressId)) {
      const index = userFromDB.address.findIndex((e) => e._id == addressId);
      console.log("index", index);
      userFromDB.address.splice(index, 1);
      console.log("working");
      userFromDB.save().then(() => {
        res.json({ result: true, message: "address deleted" });
      });
    } else {
      console.log("error in del route");
      res.json({ result: false, message: "something went wrong" });
    }

    // Cart.findOne({ ownerOfCart: user._id }).then((cartFromDB) => {
    //   if (cartFromDB.items.find((e) => e.article == articleId)) {
    //     //console.log(cartFromDB);
    //     //filter would've worked too with cartFromDB.items = cartFromDB.items.filter...
    //     const index = cartFromDB.items.findIndex((e) => e.article == articleId);
    //     console.log("index", index);
    //     cartFromDB.items.splice(index, 1);
    //     console.log("working");
    //   } else {
    //     console.log("error");
    //   }
    //   cartFromDB.save().then(() => {
    //     res.json({ result: true, message: "cart article removed" });
    //   });
    // });
  });
});

module.exports = router;

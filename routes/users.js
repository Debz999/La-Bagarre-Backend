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

/* Edit user to add the rest of the information */
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
    User.findOne({ token: req.params.token }).then((data) => {
      console.log(data);
      res.json({ result: true, user: data });
    });
  });
});


/*Edit user to add a new address */
router.put("/newadress/:token", (req, res) => {
  const { number, street, city, zipcode, country } = req.body;
  if (
    !checkBody(req.body, ["number", "street", "city", "zipcode", "country"])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ token: req.params.token })
    .then((userFromDB) => {
      userFromDB.adress.push({
        number: number,
        street: street,
        city: city,
        zipcode: zipcode,
        country: country,
      });
      userFromDB.save()
      .then(() => {
        res.json({ result: true, message: "new address added" });
      });
    });
});

/*Edit user and edit existing address */

/*

To create addresses, always push 
to choose one do a get address by id 
to edit use the route edit 
Find user, push address

    */

module.exports = router;

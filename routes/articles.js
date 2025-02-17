var express = require("express");
var router = express.Router();

const Article = require("../models/articles");

//Il faut tout les champs à changer dans req.body
//FAUT REFORMATER LES BAILS ICI

//http://localhost:3000/articles/articleUpdate/67acf52e4f0859ebff97531a
router.put("/articleUpdate/:id", (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (updateData.colors9) updateData.colors9 = updateData.colors9.split(", ");
  if (updateData.photos9) updateData.photos9 = updateData.photos9.split(", ");
  if (updateData.sizes9) updateData.sizes9 = updateData.sizes9.split(", ");
  if (updateData.giSizes9)
    updateData.giSizes9 = updateData.giSizes9.split(", ");

  Article.findById(id)
    .then((article) => {
      return Article.findByIdAndUpdate(id, updateData, { new: true }); // { new: false } (par défaut): Retourne l'objet avant la mise à jour.
    })
    .then((updatedArticle) => {
      res.json({ message: "Article mis à jour", updatedArticle });
    });
});

router.put("/articleUpdate1/:id", (req, res) => {
  // const { id } = req.params || req.body.id;
  const id = req.params.id || req.body.id;
  const updateData = req.body; //POURQUOI YA REQ.BODY ICI ET DANS L'OBJET EN BAS?
  const { //ON A RAJOUTER CA CA A DEBLOK LE PROBLEME
    categorie,
    type,
    model,
    description,
    price,
    onSale,
    soldCount,
    // categorie,
    // type,
    // model,
    // description,
    // price,
    // onSale,
    // soldCount,
    // colors9,
    // photos9,
    // sizes9,
    // giSizes9
  } = req.body;

  const colors9 = updateData.colors9.split(", ");
  const photos9 = updateData.photos9.split(", ");
  const sizes9 = updateData.sizes9.split(", ");
  const giSizes9 = updateData.giSizes9.split(", ");
  // const colors9Array = colors9 ? colors9.split(", ") : [];
  // const photos9Array = photos9 ? photos9.split(", ") : [];
  // const sizes9Array = sizes9 ? sizes9.split(", ") : [];
  // const giSizes9Array = giSizes9 ? giSizes9.split(", ") : [];

  Article.findById(id)
    .then((article) => {
      if (!article) {
        return res.status(404).json({ message: "Article non trouvé" });
      }
      //SANS LA RETURN ICI CA MARCHE PAS
      return Article.findByIdAndUpdate(//CETTE PARTIE QUI POSAIT PROBLEME, J'AVAIS SEULEMENT id, updateData, new true
        id,
        {
          // colors9: colors9Array,
          // photos9: photos9Array,
          // sizes9: sizes9Array,
          // giSizes9: giSizes9Array,
          colors9,
          photos9,
          sizes9,
          giSizes9,
          categorie,
          type,
          model,
          description,
          price,
          onSale,
          soldCount,
        },
        { new: true }
      ); // { new: false } (par défaut): Retourne l'objet avant la mise à jour.
    })
    .then((updatedArticle) => {
      if (!updatedArticle) {
        return res.status(500).json({ message: "Erreur lors de la mise à jour" });
      }
      res.json({ message: "Article mis à jour", updatedArticle });
    })
});

//http://localhost:3000/articles/articles
//Route pour get tout les articles
router.get("/articles", (req, res) => {
  Article.find().then((data) => {
    res.json({ result: true, allArticles: data });
  });
});



//route pour récueprer les articles des categories et sous catégories (gi,short,rashguard...)
router.get("/articlesCS", (req, res) => {
  const { categorie, type } = req.query;
  let filter = { categorie };
  if (type !== undefined) {
    filter.type = type;
  }
  Article.find(filter).then((data) => {
    res.json({ result: true, articles: data });
  });
});

router.get("/articlesSimililaires", (req, res) => {
  const { categorie, type } = req.query;

  // Cherche tous les articles ayant la même catégorie
  if (categorie && type) {
    Article.find({ categorie: categorie, type: type }).then((data) => {
      res.json({ result: true, filteredArticles: data });
    });
  } else {
    Article.find({}).then((data) => {
      res.json({ result: true, filteredArticles: data });
    });
  }
});

//http://localhost:3000/articles/articlesHommes
router.get("/articlesHommes", (req, res) => {
  Article.find({ categorie: "Homme" }).then((data) => {
    res.json({ result: true, articlesHommes: data });
  });
});

// router.get("/articlesHommesGi", (req, res) => {
//   Article.find({ categorie: "Homme", type: "Gi" }).then((data) => {
//     res.json({ result: true, articlesHommesGi: data });
//   });
// });

// router.get("/articlesHommesRashguard", (req, res) => {
//   Article.find({ categorie: "Homme", type: "Rashguard" }).then((data) => {
//     res.json({ result: true, articlesHommesRashguard: data });
//   });
// });

// router.get("/articlesHommesShort", (req, res) => {
//   Article.find({ categorie: "Homme", type: "Short" }).then((data) => {
//     res.json({ result: true, articlesHommesShort: data });
//   });
// });

// router.get("/articlesHommesBelt", (req, res) => {
//   Article.find({ categorie: "Homme", type: "Belt" }).then((data) => {
//     res.json({ result: true, articlesHommesBelt: data });
//   });
// });

// // http://localhost:3000/articles/articlesFemmes
// router.get("/articlesFemmes", (req, res) => {
//   Article.find({ categorie: "Femme" }).then((data) => {
//     res.json({ result: true, articlesFemmes: data });
//   });
// });

// router.get("/articlesFemmesGi", (req, res) => {
//   Article.find({ categorie: "Femmes", type: "Gi" }).then((data) => {
//     res.json({ result: true, articlesFemmesGi: data });
//   });
// });

// router.get("/articlesFemmesRashguard", (req, res) => {
//   Article.find({ categorie: "Femmes", type: "Rashguard" }).then((data) => {
//     res.json({ result: true, articlesFemmesRashguard: data });
//   });
// });

// router.get("/articlesFemmesShort", (req, res) => {
//   Article.find({ categorie: "Femmes", type: "Short" }).then((data) => {
//     res.json({ result: true, articlesFemmesShort: data });
//   });
// });

// router.get("/articlesFemmesBelt", (req, res) => {
//   Article.find({ categorie: "Femmes", type: "Belt" }).then((data) => {
//     res.json({ result: true, articlesFemmesBelt: data });
//   });
// });

// //http://localhost:3000/articles/articlesEnfants
// router.get("/articlesEnfants", (req, res) => {
//   Article.find({ categorie: "Enfant" }).then((data) => {
//     res.json({ result: true, articlesEnfants: data });
//   });
// });

// router.get("/articlesEnfantsGi", (req, res) => {
//   Article.find({ categorie: "Enfants", type: "Gi" }).then((data) => {
//     res.json({ result: true, articlesEnfantsGi: data });
//   });
// });

// router.get("/articlesEnfantsRashguard", (req, res) => {
//   Article.find({ categorie: "Enfants", type: "Rashguard" }).then((data) => {
//     res.json({ result: true, articlesEnfantsRashguard: data });
//   });
// });

// router.get("/articlesEnfantsShort", (req, res) => {
//   Article.find({ categorie: "Enfants", type: "Short" }).then((data) => {
//     res.json({ result: true, articlesEnfantsShort: data });
//   });
// });

// router.get("/articlesEnfantsBelt", (req, res) => {
//   Article.find({ categorie: "Enfants", type: "Belt" }).then((data) => {
//     res.json({ result: true, articlesEnfantsBelt: data });
//   });
// });

// //http://localhost:3000/articles/articlesAccessoires
// router.get("/articlesAccessoires", (req, res) => {
//   Article.find({ categorie: "Accessoire" }).then((data) => {
//     res.json({ result: true, articlesAccessoires: data });
//   });
// });

// //http://localhost:3000/articles/articlesOnSales
// router.get("/articlesOnSales", (req, res) => {
//   Article.find({ onSale: true }).then((data) => {
//     res.json({ result: true, articlesOnSales: data });
//   });
// });


//ROUTE POUR ARTICLE2PAGE
router.get("/:id", (req, res) => {
  Article.findById(req.params.id || req.body.id).then((data) => {
    res.json({ result: true, articleRécupéré: data });
  });
});



router.post("/postArticle1", (req, res) => {
  const {
    categorie,
    type,
    model,
    description,
    price,
    sizes9,
    giSizes9,
    colors9,
    photos9,
    onSale,
    soldCount,
  } = req.body;

  const colorsArray9 = colors9.split(", ");
  const photosArray9 = photos9.split(", ");
  const sizesArray9 = sizes9.split(", ");
  const giSizesArray9 = giSizes9.split(", ");

  const newArticle = new Article({
    categorie,
    type,
    model,
    description,
    price,
    colors9: colorsArray9,
    photos9: photosArray9,
    sizes9: sizesArray9,
    giSizes9: giSizesArray9,
    onSale,
    soldCount,
  });
  newArticle.save().then(() => {
    console.log("Article saved");
    res.json({ result: true });
  });
});

//FAUDRA AUSSI UNE ROUTE PUT POUR MODIFIER LE soldCount en bdd
//soldCount++ shai pas si ca marche mdr à test
//

module.exports = router;


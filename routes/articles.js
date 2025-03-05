var express = require("express");
var router = express.Router();

const Article = require("../models/articles");

const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uniqid = require('uniqid');





router.put("/articleUpdate1/:id", async (req, res) => {
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
    onSalePrice,
  } = req.body;

  const colors9 = updateData.colors9.split(", ");
  const photos9 = updateData.photos9.split(", ");
  const sizes9 = updateData.sizes9.split(", ");
  const giSizes9 = updateData.giSizes9.split(", ");

  let resultCloudinary = []; //Tableau qui va stocker les url
  for(const file in req.files) { //Boucle sur objet donc for in si j'ai bien compris
    const photoPath = `./tmp/${uniqid()}.jpg`; //Comme dans le cour pour mettre en place cloudinary
    const resultMove = await req.files[file].mv(photoPath);//Petite difference ici avec le cour  
    if (!resultMove) { 
      let temp = await cloudinary.uploader.upload(photoPath); //Declaration de temp 
      resultCloudinary.push(temp.secure_url) //push des infos du temp.secure_url vers le taleau resultCloudinary  
      fs.unlinkSync(photoPath);
    } else {
      res.json({ result: false, error: resultMove }); 
    }

  }


  Article.findById(id)
    .then((article) => {
      if (!article) {
        return res.status(404).json({ message: "Article non trouvé" });
      }
      //SANS LA RETURN ICI CA MARCHE PAS
      return Article.findByIdAndUpdate(//CETTE PARTIE QUI POSAIT PROBLEME, J'AVAIS SEULEMENT id, updateData, new true
        id,
        {
          colors9,
          photos9: resultCloudinary,
          sizes9,
          giSizes9,
          categorie,
          type,
          model,
          description,
          price,
          onSale,
          soldCount,
          onSalePrice,
        },
        { new: true }
      ); // { new: false } (par défaut): Retourne l'objet avant la mise à jour.
    })
    .then((updatedArticle) => {
      if (!updatedArticle) {
        return res.status(500).json({ message: "Erreur lors de la mise à jour" });
      }
      res.json({ result: true, message: "Article mis à jour", updatedArticle });
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
  // const categorieLowerCase = categorie.toLowerCase()
  // const typeLowerCase = type.toLowerCase()
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

router.get("/articlesSimilaires1", (req, res) => {
  const { categorie, type } = req.query;
  let filter = {};

  if (categorie) {
    filter.categorie = categorie;
  }

  if (type) {
    filter.type = type;
  }

  Article.find(filter)
    .then((data) => {
      res.json({ result: true, filteredArticles: data });
    })
    .catch((error) => {
      res.status(500).json({ result: false, message: "Erreur serveur", error });
    });
});


//http://localhost:3000/articles/articlesOnSales
router.get("/articlesOnSales", (req, res) => {
  Article.find({ onSale: true }).then((data) => {
    res.json({ result: true, articlesOnSales: data });
  });
});


router.get('/topArticles1', (req, res) => {
  const { categorie } = req.query;

  console.log("params recus:", req.query)

  if (!categorie) {
    return res.status(400).json({ result: false, error: "Categorie requis" });
  }

  Article.find({ categorie: categorie })
      .sort({ soldCount: -1 }) // Trie par le nombre de ventes décroissant
      .limit(10) // On récupère les 10 articles les plus vendus
      .then((data) => {
        res.json({ result: true, articleRécupéré: data });
      });

});

router.get('/topArticles', (req, res) => {
  Article.find()
      .sort({ soldCount: -1 }) // Trie par le nombre de ventes décroissant
      .limit(20) // On récupère les 10 articles les plus vendus
      .then((data) => {
        res.json({ result: true, articleRécupéré: data });
      });

});

//ROUTE POUR ARTICLE2PAGE
router.get("/:id", (req, res) => {
  Article.findById(req.params.id || req.body.id)
  .populate('reviews.userId', 'username')
  .then((data) => {
    res.json({ result: true, articleRécupéré: data });
  });
});

router.delete("/delete", (req, res) => {
  Article.findByIdAndDelete(req.body.id).then((deletedArticle) => {
    res.json({ result: true, message: "Article supprimé", deletedArticle });
  });
});

router.post("/postArticle1", async (req, res) => {

  console.log(req.body)
  console.log(req.files)
  // return res.json()

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
    onSalePrice,
  } = req.body;

  // let finalPrice = price;
  // if (onSale === "true" && onSalePrice) {
  //   finalPrice = onSalePrice; // Si en promotion, on prend le prix promo
  // }

  const colorsArray9 = colors9.split(", ");
  const photosArray9 = photos9.split(", ");
  const sizesArray9 = sizes9.split(", ");
  const giSizesArray9 = giSizes9.split(", ");
   
    // res.json({ result: true, url: resultCloudinary.secure_url });

      let resultCloudinary = []; //Tableau qui va stocker les url
      for(const file in req.files) { //Boucle sur objet donc for in si j'ai bien compris
        const photoPath = `./tmp/${uniqid()}.jpg`; //Comme dans le cour pour mettre en place cloudinary
        const resultMove = await req.files[file].mv(photoPath);//Petite difference ici avec le cour  
        if (!resultMove) { 
          let temp = await cloudinary.uploader.upload(photoPath); //Declaration de temp 
          resultCloudinary.push(temp.secure_url) //push des infos du temp.secure_url vers le taleau resultCloudinary  
          fs.unlinkSync(photoPath);
        } else {
          res.json({ result: false, error: resultMove }); 
        }

      }

   console.log(resultCloudinary)
      // return

  const newArticle = new Article({
    categorie,
    type,
    model,
    description,
    // price,
    price,
    colors9: colorsArray9,
    photos9: resultCloudinary, //resultCloudinary qui est le tableau qui contient le push du temp.secure_url
    sizes9: sizesArray9,
    giSizes9: giSizesArray9,
    onSale,
    soldCount,
    onSalePrice,
  });
  newArticle.save().then(() => {
    console.log("Article saved");
    res.json({ result: true });
  });
});








module.exports = router;


// //http://localhost:3000/articles/articlesHommes
// router.get("/articlesHommes", (req, res) => {
//   Article.find({ categorie: "Homme" }).then((data) => {
//     res.json({ result: true, articlesHommes: data });
//   });
// });

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
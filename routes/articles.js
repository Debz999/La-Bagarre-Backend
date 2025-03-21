var express = require("express");
var router = express.Router();

const Article = require("../models/articles");

const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uniqid = require("uniqid");

//UPDATE ARTICLE
//Utilisée sur le composant AjoutArticleBdd
router.put("/articleUpdate1/:id", async (req, res) => {
  const id = req.params.id || req.body.id;
  const updateData = req.body;
  const {
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

  //Boucle sur objet donc for in si j'ai bien compris
  for (const file in req.files) {
    const photoPath = `./tmp/${uniqid()}.jpg`; //Comme dans le cour pour mettre en place cloudinary
    const resultMove = await req.files[file].mv(photoPath); //Petite difference ici avec le cour
    if (!resultMove) {
      let temp = await cloudinary.uploader.upload(photoPath); //Declaration de temp
      resultCloudinary.push(temp.secure_url); //push des infos du temp.secure_url vers le taleau resultCloudinary
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
      return Article.findByIdAndUpdate(
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
      res.status(200).json({ result: true, message: "Article mis à jour", updatedArticle });
    });
});

//http://localhost:3000/articles/articles
//Route pour get tout les articles - Utilisée dans composant AllArticles
router.get("/articles", (req, res) => {
  Article.find()
    .then((data) => {
      if (data.length === 0) {
        return res.status(404).json({ result: false, message: "Aucun article trouvé" });
      } else {
        res.status(200).json({ result: true, allArticles: data });
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des articles :", error);
      res.status(500).json({ result: false, message: "Erreur serveur" });
    });
});


//route pour récupérer les articles par categories et/ou sous catégories (gi,short,rashguard...)
//Utilisée dans le composant Article
router.get("/articlesCS", (req, res) => {
  // const categorieLowerCase = categorie.toLowerCase()
  // const typeLowerCase = type.toLowerCase()
  const { categorie, type } = req.query;
  let filter = { categorie };
  if (type !== undefined) {
    filter.type = type;
  }
  Article.find(filter)
    .select("-reviews.userId")
    .then((data) => {
      if (data.length === 0) {
        return res.status(404).json({ result: false, message: "Aucun article trouvé pour ces critères" });
      } else {
        res.status(200).json({ result: true, articles: data });
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des articles :", error);
      res.status(500).json({ result: false, message: "Erreur serveur" });
    });
});


//Route pour get les articles similaires quand on est sur une page ArticleDetail
//Utilisée sur la page ArticleDetail
// router.get("/articlesSimililaires", (req, res) => {
//   const { categorie, type } = req.query;

//   // Cherche tous les articles ayant la même catégorie
//   if (categorie && type) {
//     Article.find({ categorie: categorie, type: type })
//       .select("-reviews.userId")
//       .then((data) => {
//         return res.status(200).json({ result: true, filteredArticles: data });
//       });
//   } else {
//     Article.find({})
//       .select("-reviews.userId")
//       .then((data) => {
//         return res.json({ result: true, filteredArticles: data });
//       });
//   }
// });

//http://localhost:3000/articles/articlesSimilaires
router.get("/articlesSimililaires", (req, res) => {
  const { categorie, type } = req.query;

  // Cherche tous les articles ayant la même catégorie
  if (!categorie && !type) {
    return res.status(400).json({ result: false, message: "Catégorie et/ou type manquant"})
  } else {
    Article.find({ categorie: categorie, type: type })
      .select("-reviews.userId")
      .then((data) => {
        return res.status(200).json({ result: true, filteredArticles: data });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des articles similaires :", error);
        return res.status(500).json({ result: false, message: "Erreur serveur" });
      });
  }

});



//http://localhost:3000/articles/articlesOnSales
//Route pour get les articles en promotions
//Utilisée dans le composant ArticlesOnSale
router.get("/articlesOnSales", (req, res) => {
  Article.find({ onSale: true })
    .select("-reviews.userId")
    .then((data) => {
      res.status(200).json({ result: true, articlesOnSales: data });
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des articles :", error);
      return res.status(500).json({ result: false, message: "Erreur serveur" });
    });
});


//Route pour get les articles les plus vendus
//Utilisée dans le composant TopArticlesCat
router.get("/topArticles1", (req, res) => {
  const { categorie } = req.query;

  console.log("params recus:", req.query);

  if (!categorie) {
    return res.status(400).json({ result: false, error: "Categorie requis" });
  }

  Article.find({ categorie: categorie })
    .sort({ soldCount: -1 }) // Trie par le nombre de ventes décroissant
    .select("-reviews.userId")
    .limit(10) // On récupère les 10 articles les plus vendus
    .then((data) => {
      if (data.length === 0) {
        return res.status(404).json({result: false, message: "Aucun article trouvé pour cette catégorie" });
      } else {
        return res.status(200).json({ result: true, articleRécupéré: data });
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des articles :", error);
      return res.status(500).json({ result: false, message: "Erreur serveur" });
    });
});


//Route pour get tout les articles en promotions
//Utilisée dans le composant TopArticlesAll
router.get("/topArticles", (req, res) => {
  Article.find()
    .sort({ soldCount: -1 }) // Trie par le nombre de ventes décroissant
    .select("-reviews.userId")
    .limit(20)
    .then((data) => {
      if (data.length === 0) {
        return res.status(404).json({ result: false, message: "Aucun article trouvé" });
      } else {
        return res.status(200).json({ result: true, articleRécupéré: data });
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des articles :", error);
      return res.status(500).json({ result: false, message: "Erreur serveur" });
    });
});

//ROUTE POUR ArticleDetail
//http://localhost:3000/articles/:id
router.get("/:id", (req, res) => {
  // Article.findById(req.params.id || req.body.id)
  Article.findOne({ _id: req.params.id || req.body.id })
    .populate("reviews.userId", "username")
    .select("-reviews.userId")
    .then((data) => {
      if (data.length === 0) {
        return res.status(404).json({result: false, message: "Aucun article trouvé" });
      } else {
        return res.status(200).json({ result: true, articleRécupéré: data });
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des articles :", error);
      return res.status(500).json({result: false,message: "Erreur serveur" });
    });
});






router.delete("/delete", (req, res) => {
  Article.findByIdAndDelete(req.body.id).then((deletedArticle) => {
    res.json({ result: true, message: "Article supprimé", deletedArticle });
  });
});

//CREATE NEW ARTICLE
//Utilisée sur le composant AjoutArticleBdd
router.post("/postArticle1", async (req, res) => {
  console.log(req.body);
  console.log(req.files);
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

  const colorsArray9 = colors9.split(", ");
  const photosArray9 = photos9.split(", ");
  const sizesArray9 = sizes9.split(", ");
  const giSizesArray9 = giSizes9.split(", ");

  let resultCloudinary = []; //Tableau qui va stocker les url
  for (const file in req.files) {
    //Boucle sur objet donc for in
    const photoPath = `./tmp/${uniqid()}.jpg`; //Comme dans le cour pour mettre en place cloudinary
    const resultMove = await req.files[file].mv(photoPath); //Petite difference ici avec le cour
    if (!resultMove) {
      let temp = await cloudinary.uploader.upload(photoPath); //Declaration de temp
      resultCloudinary.push(temp.secure_url); //push des infos du temp.secure_url vers le taleau resultCloudinary
      fs.unlinkSync(photoPath);
    } else {
      res.json({ result: false, error: resultMove });
    }
  }

  console.log(resultCloudinary);
  // return

  const newArticle = new Article({
    categorie,
    type,
    model,
    description,
    price,
    colors9: colorsArray9,
    photos9: resultCloudinary, //resultCloudinary qui est le tableau qui contient le push du temp.secure_url
    sizes9: sizesArray9,
    giSizes9: giSizesArray9,
    onSale,
    soldCount,
    onSalePrice,
  });
  newArticle.save().then((data) => {
    if(!data) {
      return res.status(500).json({ result: false, message: "Erreur lors de l'enregistrement de l'article." });
    } else {
      console.log("Article saved:", data)
      return res.status(200).json({ result: true, "Article enregistré: ": data })
    }
  })
  });


module.exports = router;

var express = require("express");
var router = express.Router();

const Article = require("../models/articles");

const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uniqid = require("uniqid");

//UPDATE ARTICLE - backend only
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
        return res
          .status(500)
          .json({ message: "Erreur lors de la mise à jour" });
      }
      res.json({ result: true, message: "Article mis à jour", updatedArticle });
    });
});

//http://localhost:3000/articles/articles
//Route pour get tout les articles - backend only for testing
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
  Article.find(filter)
    .select("-reviews.userId")
    .then((data) => {
      res.json({ result: true, articles: data });
    });
});

router.get("/articlesSimililaires", (req, res) => {
  const { categorie, type } = req.query;

  // Cherche tous les articles ayant la même catégorie
  if (categorie && type) {
    Article.find({ categorie: categorie, type: type })
      .select("-reviews.userId")
      .then((data) => {
        res.json({ result: true, filteredArticles: data });
      });
  } else {
    Article.find({})
      .select("-reviews.userId")
      .then((data) => {
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
    .select("-reviews.userId")
    .then((data) => {
      res.json({ result: true, filteredArticles: data });
    })
    .catch((error) => {
      res.status(500).json({ result: false, message: "Erreur serveur", error });
    });
});

//http://localhost:3000/articles/articlesOnSales
router.get("/articlesOnSales", (req, res) => {
  Article.find({ onSale: true })
    .select("-reviews.userId")
    .then((data) => {
      res.json({ result: true, articlesOnSales: data });
    });
});

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
      res.json({ result: true, articleRécupéré: data });
    });
});

router.get("/topArticles", (req, res) => {
  Article.find()
    .sort({ soldCount: -1 }) // Trie par le nombre de ventes décroissant
    .select("-reviews.userId")
    .limit(20)
    .then((data) => {
      res.json({ result: true, articleRécupéré: data });
    });
});

//ROUTE POUR ARTICLE2PAGE
//http://localhost:3000/articles/:id
router.get("/:id", (req, res) => {
  // Article.findById(req.params.id || req.body.id)
  Article.findOne({ _id: req.params.id || req.body.id })
    .populate("reviews.userId", "username")
    .then((data) => {
      console.log(data);
      res.json({ result: true, articleRécupéré: data });
    });
});

router.delete("/delete", (req, res) => {
  Article.findByIdAndDelete(req.body.id).then((deletedArticle) => {
    res.json({ result: true, message: "Article supprimé", deletedArticle });
  });
});

//CREATE NEW ARTICLE - backend only
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
  newArticle.save().then(() => {
    console.log("Article saved");
    res.json({ result: true });
  });
});

module.exports = router;

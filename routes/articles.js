var express = require('express');
var router = express.Router();

const Article = require('../models/articles');

//http://localhost:3000/articles/articles
//Route pour get tout les articles
router.get('/articles', (req, res) => {
    Article.find().then(data => {
      res.json({ allArticles: data });
    });
});


//http://localhost:3000/articles/articlesHommes
router.get('/articlesHommes', (req, res) => {
    Article.find({ categorie: "Homme"}).then(data => {
      res.json({ articlesHommes: data });
    });
});

        router.get('/articlesHommesGi', (req, res) => {
            Article.find({ categorie: "Homme", type: "Gi"}).then(data => {
            res.json({ articlesHommesGi: data });
            });
        });

        router.get('/articlesHommesRashguard', (req, res) => {
            Article.find({ categorie: "Homme", type: "Rashguard"}).then(data => {
            res.json({ articlesHommesRashguard: data });
            });
        });

        router.get('/articlesHommesShort', (req, res) => {
            Article.find({ categorie: "Homme", type: "Short"}).then(data => {
            res.json({ articlesHommesShort: data });
            });
        });

        router.get('/articlesHommesBelt', (req, res) => {
            Article.find({ categorie: "Homme", type: "Belt"}).then(data => {
            res.json({ articlesHommesBelt: data });
            });
        });



// http://localhost:3000/articles/articlesFemmes
router.get('/articlesFemmes', (req, res) => {
    Article.find({ categorie: "Femme"}).then(data => {
      res.json({ articlesFemmes: data });
    });
});

        router.get('/articlesFemmesGi', (req, res) => {
            Article.find({ categorie: "Femmes", type: "Gi"}).then(data => {
            res.json({ articlesFemmesGi: data });
            });
        });

        router.get('/articlesFemmesRashguard', (req, res) => {
            Article.find({ categorie: "Femmes", type: "Rashguard"}).then(data => {
            res.json({ articlesFemmesRashguard: data });
            });
        });

        router.get('/articlesFemmesShort', (req, res) => {
            Article.find({ categorie: "Femmes", type: "Short"}).then(data => {
            res.json({ articlesFemmesShort: data });
            });
        });

        router.get('/articlesFemmesBelt', (req, res) => {
            Article.find({ categorie: "Femmes", type: "Belt"}).then(data => {
            res.json({ articlesFemmesBelt: data });
            });
        });


//http://localhost:3000/articles/articlesEnfants
router.get('/articlesEnfants', (req, res) => {
    Article.find({ categorie: "Enfant"}).then(data => {
      res.json({ articlesEnfants: data });
    });
});

        router.get('/articlesEnfantsGi', (req, res) => {
            Article.find({ categorie: "Enfants", type: "Gi"}).then(data => {
            res.json({ articlesEnfantsGi: data });
            });
        });

        router.get('/articlesEnfantsRashguard', (req, res) => {
            Article.find({ categorie: "Enfants", type: "Rashguard"}).then(data => {
            res.json({ articlesEnfantsRashguard: data });
            });
        });

        router.get('/articlesEnfantsShort', (req, res) => {
            Article.find({ categorie: "Enfants", type: "Short"}).then(data => {
            res.json({ articlesEnfantsShort: data });
            });
        });

        router.get('/articlesEnfantsBelt', (req, res) => {
            Article.find({ categorie: "Enfants", type: "Belt"}).then(data => {
            res.json({ articlesEnfantsBelt: data });
            });
        });



//http://localhost:3000/articles/articlesAccessoires
router.get('/articlesAccessoires', (req, res) => {
    Article.find({ categorie: "Accessoire"}).then(data => {
      res.json({ articlesAccessoires: data });
    });
});


//http://localhost:3000/articles/articlesOnSales
router.get('/articlesOnSales', (req, res) => {
    Article.find({ onSale: true }).then(data => {
      res.json({ articlesOnSales: data });
    });
});

//http://localhost:3000/articles/postArticle
//Route post pour ajouter des articles en BDD surement accessible depuis un role ADMIN
router.post('/postArticle', (req, res) => {
    const { categorie, type, model, description, sizes, giSizes, colors, photos, price } = req.body;

    //Bon ca marche mais va falloir expliquer le split et le trim
    //Sans ca on a pas des couleurs ou photos en objts individuels
    const colorsArray = Array.isArray(colors) ? colors.map(color => ({ colorName0: color })) : colors.split(', ').map(color => ({ colorName0: color.trim() }));
    const photosArray = Array.isArray(photos) ? photos.map(photo => ({ photoUrl0: photo })) : photos.split(', ').map(photo => ({ photoUrl0: photo.trim() }));
    const sizesArray = Array.isArray(sizes) ? sizes.map(size => ({ size0: size })) : sizes.split(', ').map(size => ({ size0: size.trim() }));
    const giSizesArray = Array.isArray(giSizes) ? giSizes.map(giSize => ({ giSize0: giSize })) : giSizes.split(', ').map(giSize => ({ giSize0: giSize.trim() }));
        // Vérification : Array.isArray(colors)
        // Si colors est déjà un tableau, on le mappe (.map()) en transformant chaque élément en un objet { name: color }.
        // Sinon, on suppose que colors est une chaîne de caractères contenant des couleurs séparées par , (exemple : "red, blue, green").
        // On utilise .split(', ') pour la découper en un tableau.
        // Puis .map(color => ({ name: color.trim() })) crée des objets { name: color }.
    const newArticle = new Article({
        categorie,
        type,
        model,
        description,
        sizes: sizesArray,
        giSizes: giSizesArray,
        colors: colorsArray, 
        photos: photosArray,
        price,
    });
    newArticle.save().then(()=> {
        console.log("Article saved")
        res.json({ result: true})
    });
});


//Il me faut aussi une route post pour ajouter dans la bdd cart
//Ici tout s'ajoute sur la bdd articles
//Comment faire pour ajouter dans la bdd cart depuis la bdd articles..



   
module.exports = router;
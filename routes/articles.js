var express = require('express');
var router = express.Router();

//Je suis pas sur faudra demander, on les ajoutes d'où en bdd les articles ? :o
//Estcequ'il faut un acces admin sur la page pour pouvoir faire ca ? 
//Le post ne doit pas être accessible depuis le front sinon les users randoms vont ajouter n'importe quoi


const Article = require('../models/articles');

//http://localhost:3000/articles/articles
router.get('/articles', (req, res) => {
    Article.find().then(data => {
      res.json({ allArticles: data });
    });
   });


//http://localhost:3000/articles/postArticle
router.post('/postArticle', (req, res) => {
    const { type, model, description, size, giSize, colors, photos, price } = req.body;

    //Bon ca marche mais va falloir expliquer le split et le trim
    //Sans ca on a pas des couleurs ou photos en objts individuels
    const colorsArray = Array.isArray(colors) ? colors.map(color => ({ name: color })) : colors.split(', ').map(color => ({ name: color.trim() }));
    const photosArray = Array.isArray(photos) ? photos.map(photo => ({ url: photo })) : photos.split(', ').map(photo => ({ url: photo.trim() }));

    const newArticle = new Article({
        type,
        model,
        description,
        size,
        giSize,
        // colors, 
        // photos,
        colors: colorsArray, 
        photos: photosArray,
        price,
    });
    newArticle.save().then(()=> {
        console.log("Article saved")
        res.json({ result: true})
    });
});







   
module.exports = router;
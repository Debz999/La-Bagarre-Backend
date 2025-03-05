
const express = require('express');
const router = express.Router();
const Article = require('../models/articles'); // Modèle d'article
const User = require('../models/users');

// Route POST pour ajouter un avis à un article
//http://localhost:3000/reviews/articles/67c2ebf495c755ab42b6487b/reviews 
router.post('/articles/:articleId/reviews', (req, res) => {
    const { articleId } = req.params;
    const { token ,rating, comment } = req.body;
    // const userId = req.user.id; // Récupération automatique du userId depuis le token
    // const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json({ result: false, error: "Token manquant" });
      }
      User.findOne({ token: token }).then((user) => {
        if (!user) {
          return res.status(404).json({ result: false, error: "Utilisateur non trouvé" });
        }
    

    Article.findById(articleId)  // Recherche de l'article dans la base de données
        .then((article) => {
            // Si l'article n'existe pas, renvoyer une erreur
            if (!article) {
                return res.status(404).send('Article non trouvé');
            }

            // Ajouter l'avis à l'article
            article.reviews.push({ rating, comment, userId: user._id, date: new Date() });

            // Sauvegarder l'article avec le nouvel avis
            return article.save();
        })
        .then(() => {
            res.status(200).send('Avis ajouté à l\'article avec succès !');
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Erreur lors de l\'ajout de l\'avis');
        });
    });
});

//Pas eu besoin de lui dans detail articles, on passe par l'article direct vu que c'est sous document les avis
// Route GET pour récupérer tous les avis d'un article
//http://localhost:3000/reviews/articles/67c2ebf495c755ab42b6487b/reviews
router.get('/articles/:articleId/reviews', (req, res) => {
    const { articleId } = req.params;

    Article.findById(articleId)
        .then((article) => {
            res.status(200).json(article.reviews);
        });
});

// Route DELETE pour supprimer un avis d'un article
//http://localhost:3000/reviews/articles/67c2ebf495c755ab42b6487b/reviews/67c61064f6d63c0242b810a6
router.delete('/articles/:articleId/reviews/:reviewId', (req, res) => {
    const { articleId, reviewId } = req.params;

    Article.findById(articleId)
        .then((article) => {
            article.reviews = article.reviews.filter(
                (review) => review._id.toString() !== reviewId
            );
            return article.save();
        })
        .then(() => {
            res.status(200).send('Avis supprimé avec succès !');
        });
});


module.exports = router;
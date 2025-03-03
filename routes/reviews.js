// const express = require('express');
// const router = express.Router();
// const Article = require('../models/articles'); // Modèle d'article
// const User = require('../models/users'); // Modèle d'utilisateur

// // Route POST pour ajouter un avis à un article
// router.post('/articles/:articleId/reviews', (req, res) => {
//     const { articleId } = req.params;
//     const { userId, rating, comment } = req.body;

//     Article.findById(articleId)
//         .then((article) => {
//             article.reviews.push({ userId, rating, comment });
//             return article.save();
//         })
//         .then(() => {
//             res.status(200).send('Avis ajouté à l\'article avec succès !');
//         });
// });

// // Route GET pour récupérer tous les avis d'un article
// router.get('/articles/:articleId/reviews', (req, res) => {
//     const { articleId } = req.params;

//     Article.findById(articleId)
//         .then((article) => {
//             res.status(200).json(article.reviews);
//         });
// });

// // Route DELETE pour supprimer un avis d'un article
// router.delete('/articles/:articleId/reviews/:reviewId', (req, res) => {
//     const { articleId, reviewId } = req.params;

//     Article.findById(articleId)
//         .then((article) => {
//             article.reviews = article.reviews.filter(
//                 (review) => review._id.toString() !== reviewId
//             );
//             return article.save();
//         })
//         .then(() => {
//             res.status(200).send('Avis supprimé avec succès !');
//         });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Article = require('../models/articles'); // Modèle d'article

// Route POST pour ajouter un avis à un article
//http://localhost:3000/reviews/articles/67c2ebf495c755ab42b6487b/reviews 
router.post('/articles/:articleId/reviews', (req, res) => {
    const { articleId } = req.params;
    const { userId, rating, comment } = req.body;

    Article.findById(articleId)  // Recherche de l'article dans la base de données
        .then((article) => {
            // Si l'article n'existe pas, renvoyer une erreur
            if (!article) {
                return res.status(404).send('Article non trouvé');
            }

            // Ajouter l'avis à l'article
            article.reviews.push({ userId, rating, comment });

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
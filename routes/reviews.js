const express = require("express");
const router = express.Router();
const Article = require("../models/articles"); // Modèle d'article
const User = require("../models/users");

// Route POST pour ajouter un avis à un article
//http://localhost:3000/reviews/articles/67c2ebf495c755ab42b6487b/reviews
router.post("/articles/:articleId/reviews", (req, res) => {
  const { articleId } = req.params;
  const { token, rating, comment } = req.body;

  if (!token) {
    return res.status(400).json({ result: false, error: "Token manquant" });
  }
  User.findOne({ token: token }).then((user) => {
    if (!user) {
      return res
        .status(404)
        .json({ result: false, error: "Utilisateur non trouvé" });
    }

    Article.findById(articleId) // Recherche de l'article dans la base de données
      .then((article) => {
        if (!article) {
          return res.status(404).json({ result: false, message: "Article non trouvé" });
        }

        // Ajouter l'avis à l'article
        article.reviews.push({
          rating,
          comment,
          userId: user._id,
          date: new Date(),
        });

        // Sauvegarder l'article avec le nouvel avis
        return article.save();
      })
      .then((updatedArticle) => {
        res.status(200).json({message: "Avis ajouté avec succès !", article: updatedArticle });  // On renvoie l'article mis à jour avec les reviews
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'ajout de l'avis" });
      });
  });
});

//Pas eu besoin de lui dans detail articles, on passe par l'article direct vu que c'est sous document les avis
// Route GET pour récupérer tous les avis d'un article
//http://localhost:3000/reviews/articles/67c2ebf495c755ab42b6487b/reviews
router.get("/articles/:articleId/reviews", (req, res) => {
  const { articleId } = req.params;

  Article.findById(articleId).then((article) => {
    res.status(200).json(article.reviews);
  });
});

// Route DELETE pour supprimer un avis d'un article
//http://localhost:3000/reviews/articles/67c2ebf495c755ab42b6487b/reviews/67c61064f6d63c0242b810a6
// router.delete('/articles/:articleId/reviews/:reviewId', (req, res) => {
//     const { articleId, reviewId } = req.params;
//     const {token, reviewUserId} = req.body;

//     User.findOne({ token: token })
//     .then((tokenUser) => {

//     })

//     Article.findById(articleId)
//         .then((article) => {
//             console.log("article du delete reviews:", article)
//             // res.json({article})
//             article.reviews = article.reviews.filter(
//                 (review) => review._id.toString() !== reviewId
//             );
//             return article.save();
//         })
//         .then(() => {
//             res.status(200).json({ message: 'Avis supprimé avec succès !' });  // Réponse sous forme d'objet
//         })
// });



router.delete("/articles/:articleId/reviews/:reviewId", (req, res) => {
  const { articleId, reviewId } = req.params;
  const { token, reviewUserId } = req.body;

  let tokenUser;

  // Étape 1 : Trouver l'utilisateur
  User.findOne({ token: token })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ result: false, message: "Utilisateur non trouvé ou token invalide." }); //401 = token invalide ou utilisateur pas identifié
      }

      tokenUser = user; // on le stocke pour la suite

      // Étape 2 : Vérifier que l'utilisateur est bien l'auteur de l'avis
      if (tokenUser._id.toString() !== reviewUserId) {
        return res.status(403).json({ result: false, message: "Vous n'êtes pas autorisé à supprimer cet avis." }); //403 = n'a pas les permissions necessaires
      }

      // Étape 3 : Trouver l'article
      return Article.findById(articleId);
    })
    .then((article) => {
      if (!article) {
        return res.status(404).json({ result: false, message: "Article non trouvé." });
      }

      const review = article.reviews.find(
        (review) => review._id.toString() === reviewId
      );

      if (!review) {
        return res.status(404).json({ result: false, message: "Avis non trouvé." });
      }

      // Étape 5 : Supprimer l'avis
      article.reviews = article.reviews.filter(
        (review) => review._id.toString() !== reviewId
      );

      return article.save();
    })
    .then((savedArticle) => {
      if (savedArticle) {
        return res.status(200).json({ result: true, message: "Avis supprimé avec succès" });
      }
    })
    .catch((err) => {
      console.error(err);
      if (!res.headersSent) {
        res.status(500).json({ result: false, message: "Erreur serveur lors de la suppression de l'avis." });
      }
    });
});

module.exports = router;

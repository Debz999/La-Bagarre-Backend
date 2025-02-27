const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    categorie: String,
	type: String,
	model: String,
    description: String,
    // cardPhoto: String,
    sizes9: [String],
    giSizes9: [String],
    colors9: [String], // Tableau de chaînes de caractères
	photos9: [String], // Tableau de chaînes de caractères
    price: Number,
    onSale: Boolean, //Pour pouvoir filtrer les articles en promos seulement //Doit être false par defaut
    onSalePrice: Number,
    soldCount: Number, 
    //FAUT METTRE DEFAULT FALSE POUR ONSALE     
    //il faut aussi un soldCount pour la catégorie articles les plus vendus
});

const Article = mongoose.model('articles', articleSchema);

module.exports = Article;

// sizes: [{ size0: String }],
// giSizes: [{ giSize0: String }],
// colors: [{ colorName0: String }],  // ✅ Chaque couleur est un objet { name: "Rouge" }
// photos: [{ photoUrl0: String }],   // ✅ Chaque photo est un objet { url: "image1.jpg" }
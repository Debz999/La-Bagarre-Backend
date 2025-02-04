const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    categorie: String,
	type: String,
	model: String,
    description: String,
	sizes: [{ size0: String }],
    giSizes: [{ giSize0: String }],
    colors: [{ colorName0: String }],  // ✅ Chaque couleur est un objet { name: "Rouge" }
    photos: [{ photoUrl0: String }],   // ✅ Chaque photo est un objet { url: "image1.jpg" }
	// // colors: [{String}], //Synthaxe pas bonne
	// // photos: [{String}], //Synthaxe pas bonne
    // colors: [String], // Tableau de chaînes de caractères
	// photos: [String], // Tableau de chaînes de caractères
    price: Number,
    onSale: Boolean, //Pour pouvoir filtrer les articles en promos seulement
    //il faut aussi un soldCount pour la catégorie articles les plus vendus
});

const Article = mongoose.model('articles', articleSchema);

module.exports = Article;
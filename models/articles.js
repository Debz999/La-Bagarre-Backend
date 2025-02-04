const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
	type: String,
	model: String,
    description: String,
	size: String,
    giSize: String,
    colors: [{ name: String }],  // ✅ Chaque couleur est un objet { name: "Rouge" }
    photos: [{ url: String }],   // ✅ Chaque photo est un objet { url: "image1.jpg" }
	// // colors: [{String}], //Synthaxe pas bonne
	// // photos: [{String}], //Synthaxe pas bonne
    // colors: [String], // Tableau de chaînes de caractères
	// photos: [String], // Tableau de chaînes de caractères
    price: Number,
});

const Article = mongoose.model('articles', articleSchema);

module.exports = Article;
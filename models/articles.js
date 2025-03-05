const mongoose = require('mongoose');

// const reviewSchema = mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },  // Référence à l'utilisateur qui laisse l'avis
//     rating: { type: Number, min: 1, max: 5 },  // Note de l'avis (1 à 5)
//     comment: { type: String },  // Commentaire de l'avis
//     date: { type: Date, default: Date.now }  // Date de l'avis
// });



const articleSchema = mongoose.Schema({
    categorie: String,
	type: String,
	model: String,
    description: String,
    sizes9: [String],
    giSizes9: [String],
    colors9: [String], 
	photos9: [String], 
    price: Number,
    onSale: Boolean,
    onSalePrice: Number,
    soldCount: Number, 
    // reviews: [reviewSchema],  // Tableau d'avis attachés à l'article

});

const Article = mongoose.model('articles', articleSchema);

module.exports = Article;


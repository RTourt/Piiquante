//  import du package
const mongoose = require('mongoose');


//  schema de données pour la base de données MongoDb
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true, min: 0, max: 10 },
    likes: { type: Number, required: true, default: 0 },
    dislikes: { type: Number, required: true, default: 0 },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
});


//  exportation du schema Sauce
module.exports = mongoose.model('Sauce', sauceSchema);
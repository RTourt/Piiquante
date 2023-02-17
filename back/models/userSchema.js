//  import des packages
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


//  schema de données pour la base de données MongoDb
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});


//  la valeur unique , avec l'élément mongoose-unique-validator passé en plug-in, s'assurera que deux utilisateurs ne puissent partager la même adresse e-mail.
userSchema.plugin(uniqueValidator);


//  exportation du schema User
module.exports = mongoose.model('User', userSchema);
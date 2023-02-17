//  import des packages
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

//  routes
const sauceRoutes = require('./routes/sauceRoutes');
const userRoutes = require('./routes/userRoutes');

//  démarrage de l'appli Express
const app = express();

//  connexion à MongoDb
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

//  config des CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//  paramêtres des routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)

module.exports = app;

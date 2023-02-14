const express = require('express');
const mongoose = require('mongoose');

//  routes
const sauceRoutes = require('./routes/sauceRoutes');
const userRoutes = require('./routes/userRoutes');

//  démarrage de l'appli Express
const app = express();

//  connexion à MongoDb
mongoose
    .connect('mongodb+srv://Romain:Joker666@cluster0.vvgd9gn.mongodb.net/?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json);

//  config des CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});



app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' })
})


//  paramêtres des routes
app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)

module.exports = app;
// import des packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// import du modèle utilisateur
const User = require('../models/userSchema');

//  utilisation de la variable d'environnement pour la clé secrete du token JWT
const SECRET_KEY = process.env.SECRET_KEY;


// inscription de nouveaux utilisateurs avec vérification de l'email et du password
exports.signup = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe' });
    }

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error: 'Erreur serveur' }));
};


// connexion de l'utilisateur ayant déjà un compte
exports.login = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe' });
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            SECRET_KEY,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error: 'Erreur serveur' }));
        })
        .catch(error => res.status(500).json({ error: 'Erreur serveur' }));
};

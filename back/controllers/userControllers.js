//  import des packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//  import du modèle utilisateur
const User = require('../models/userSchema');


// inscription de nouveaux utilisateurs
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.params, 10)        //  hash du password
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};


//  connexion de l'utilisateur ayant déjà un compte
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })     //  cherche un utilisateur dans la base de données
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password)        //  compare les hash des 2 passwords
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
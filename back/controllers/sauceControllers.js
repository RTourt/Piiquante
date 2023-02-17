//  import du modèle sauce
const Sauce = require('../models/sauceSchema');

//  import du package
const fs = require('fs');


//  ajout d'une nouvelle sauce
exports.addSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);

    //  création d'un nouvel objet sauce
    const sauce = new Sauce({
        ...sauceObject,
        // userId: req.auth.userId,
        //  création de l'url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    //  sauvegarde de l'objet sauce
    sauce.save()
        .then(() => {
            res.status(201).json({ message: 'Sauce enregistrée !' });
        })
        .catch((error) => {
            res.status(400).json({ error: error });
        });
};


//  modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject._userId;

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Pas authorisé' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};


//  suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Pas authorisé' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimée !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};


//  récupération d'une sauce via id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({ error: error });
        })
};


//  récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({ error: error });
        });
};


//  ajout d'un like ou dislike
exports.likeSauce = (req, res, next) => {
    // vérification de l'entrée
    if (req.body.like === 1) { // Like
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if (!sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId },
                        _id: req.params.id
                    })
                        .then(() => res.status(200).json({ message: 'Like ajouté !' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(500).json({ error }));
    } else if (req.body.like === -1) { // Dislike
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if (!sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { dislikes: 1 },
                        $push: { usersDisliked: req.body.userId },
                        _id: req.params.id
                    })
                        .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(500).json({ error }));
    } else { // Annulation d'un like ou dislike
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.body.userId },
                        _id: req.params.id
                    })
                        .then(() => res.status(200).json({ message: 'Like retiré !' }))
                        .catch(error => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: req.body.userId },
                        _id: req.params.id
                    })
                        .then(() => res.status(200).json({ message: 'Dislike retiré !' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
    }
}
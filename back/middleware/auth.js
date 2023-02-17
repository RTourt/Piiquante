// import du package
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

// validation de l'userId avec le token
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // extraction du token se trouvant dans le header Authorization et split pour tout récupérer après l'espace dans le header  
        const { userId } = jwt.verify(token, SECRET_KEY); // vérification de la validité du token et extraction de l'userId du token
        req.auth = { userId }; // ajout de l'userId à request pour que les routes puissent l'utiliser
        next();
    } catch (error) {
        res.status(401).json({ error }); // en cas d'erreur lors de la validation du token
    }
};



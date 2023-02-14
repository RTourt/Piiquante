const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];              //  extraction du token se trouvant dans le header Authorization et split pour tout récupérer après l'espace dans le header  
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');      //  vérification de la validité du token
        const userId = decodedToken.userId;                                 //  extraction de l'userId du token et l'ajoute à request pour que les routes puissent l'utiliser
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
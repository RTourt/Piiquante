const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    // création d'un objet de config pour multer
    destination: (req, file, callback) => {     //  destination indique à multer d'enregistrer les fichiers dans le dossier images
        callback(null, 'images');
    },
    filename: (req, file, callback) => {        //  filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par _ et ajout de Date.now() comme nom de fichier
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];        //  utilisation du dictionnaire de type MIME pour l'extension de fichier
        callback(null, name + Date.now() + '.' + extension);
    }
});
//  export de multer qui ets config pour gérer les telechargements de fichiers image
module.exports = multer({ storage: storage }).single('image');
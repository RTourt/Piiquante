//  import du package
const multer = require('multer');


//  extension des fichiers image
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};


const storage = multer.diskStorage({
    //  sauvegarde dans images
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    //  on indique à multer d'utiliser le nom d'origine, de remplacer les espaces par _ + ajout de Date.now() + . + extension (dictionnaire de type MIME)
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

//  export de multer qui ets config pour gérer les telechargements de fichiers image
module.exports = multer({ storage: storage }).single('image');
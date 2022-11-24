const multer = require('multer');

//définition des différentes extensions de fichiers images
const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
}

// constant nécessaire à la configuration de multer pour qu'il sache où enregistré les fichiers
const storage = multer.diskStorage({
    destination : (req, file, callback) => { //permet d'enregistrer les fichiers entrant dans le dossier images
        callback(null, 'images');
    },
    filename : (req, file, callback) => {
        //on utile le nom d'origine et on retire les espaces pour les remplacer par des underscores
        const name = file.originalname.split(' ').join('_');
        //ajout d'un timestamp Date.now comme nom de fichier et uilisation de la bibliothèque MIME pour l'extension fichier
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension); 
    }
});

module.exports = multer({ storage : storage }).single('image')
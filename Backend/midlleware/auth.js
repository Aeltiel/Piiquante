const jwt = require('jsonwebtoken');
const toKen = process.env.TOKEN
module.exports = (req, res, next) => {
    try{
        //récupération du token en le séparant par l'espace et en le récupérant dans le tableau ainsi généré
        const token = req.headers.authorization.split(' ')[1];
        //on utilise la méthode verify avec en argument le token récup et la clé secrète de décodage
        const decodedToken = jwt.verify(token, toKen);
        //extraction de l'id utilisateur de notre token et on le rajoute dans la request pour que les routes puissent l'utiliser
        const userId = decodedToken.userId;
        req.auth = {userId : userId};
        next();
    }
    catch(error){res.status(401).json({ error })};
}
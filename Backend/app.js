const express = require('express');
const mongoose = require('mongoose');
const app = express(); // création de 'lapplication Express avec la méthode express()
const dotenv = require("dotenv").config();

const connect = process.env.CONNECTBDD;
mongoose.connect(connect,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log("Connexion à MongoDB échouée !"));

//permet de prendre toutes les requetes qui on comme contenu un json et met a disposition le contenu sur l'objet req
app.use(express.json());
//ne prend pas de paramètre pour s'appliquer à toutes les routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //permet à tous d'accéder à notre API (le symbole * pour tous le monde)
    //ajouter les headers mentionnés aux requêtes vers notre APi
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //permet d'envoyer des requetes avec les méthodes mentionnées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//import des routes mis dans un fichier à part
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
//indique à Express qu'il faut géré la ressources images de manière statique(un sous répertoire de celui de base, __dirname)
//à chaque fois qu'elle reçoit une requete vers la route /images
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
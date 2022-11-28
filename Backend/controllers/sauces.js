const Sauces = require('../models/sauces');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    console.log(sauceObject)
    delete sauceObject._id;
    const sauce = new Sauces({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes : 0,
        dislikes : 0,
    });
    sauce.save()
    .then(() => {
        res.status(201).json({message : "Sauce enregistrée"})
    })
    .catch(err => res.status(400).json({error : error}))
}

exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).send(sauce))
        .catch(error => res.status(404).json({ error }));
    /* Sauces.findById(req.params.id) */
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauces.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Non authorisé" })
            } else {
                Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(401).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauces.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
        .catch(error => res.status(401).json({ error }));
}

exports.getAllSauce = (req, res, next) =>{
    Sauces.find()
        .then(sauces => res.status(200).send(sauces))
        .catch(error => res.status(400).json({ error }));
}

/*exports.likeSauce = (req, res, next) =>{
    Sauces.findOne({ _id: req.params.id })
        .then((sauce) =>{})
        .catch(error => res.status(401).json({ error }))
}*/

exports.likeSauce = (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id

    if (like === 1){
        Sauces.updateOne({_id : sauceId}, {
            $push : {
                usersLiked : userId
            },
            $inc : {
                likes : +1
            }
        })
        .then(() => res.status(200).json({message : "Sauce like"}))
        .catch(error => res.status(400).json({ error }))
    }
    if (like === 0){
        Sauces.findById(sauceId).then(sauce => {
            if (sauce.usersLiked.includes(userId)){
                // Ca veux dire que l'utilisateur avait liké et on retire son like
                Sauces.updateOne({_id : sauceId}, {
                    $inc : {
                        likes : -1
                    },
                    $pull : {
                        usersLiked : userId
                    }
                })
                .then()
                .catch()
            }
        })
    }
}
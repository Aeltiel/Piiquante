const Sauces = require('../models/sauces');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    console.log(sauceObject)
    delete sauceObject._id;
    const sauce = new Sauces({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
    });
    sauce.save()
        .then(() => {
            res.status(201).json({ message: "Sauce enregistrée" })
        })
        .catch(err => res.status(400).json({ error: err }))
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

exports.getAllSauce = (req, res, next) => {
    Sauces.find()
        .then(sauces => res.status(200).send(sauces))
        .catch(error => res.status(400).json({ error }));
}

exports.likeSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (req.body.like) {
                case 1:
                    if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                        Sauces.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { likes: 1 },
                                $push: { usersLiked: req.body.userId }
                            }
                        )
                            .then(() => res.status(201).json({ message: "Sauce like" }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;
                case -1:
                    if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
                        Sauces.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { dislikes: 1 },
                                $push: { usersDisliked: req.body.userId }
                            }
                        )
                            .then(() => res.status(201).json({ message: "Sauce dislike" }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;
                case 0:
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauces.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { likes: -1 },
                                $pull: { usersLiked: req.body.userId }
                            }
                        )
                            .then(() => res.status(201).json({ message: "like retiré" }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauces.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { dislikes: -1 },
                                $pull: { usersDisliked: req.body.userId }
                            }
                        )
                            .then(() => res.status(201).json({ message: "Dislike retiré" }))
                            .catch(error => res.status(400).json({ error }));

                    }
                    break;
            }
        })
        .catch(error => res.status(401).json({ error }));
}

/*exports.likeSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => {
            //like = 1
            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                Sauces.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Sauce like" }))
                    .catch(error => res.status(400).json({ error }));
            }

            //like = 0
            if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
                Sauces.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "like retiré" }))
                    .catch(error => res.status(400).json({ error }));
            }

            //dislike = 1
            if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
                Sauces.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { dislikes: 1 },
                        $push: { usersDisliked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Sauce dislike" }))
                    .catch(error => res.status(400).json({ error }));
            }

            //dislike = 0
            if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
                Sauces.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Dislike retiré" }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(401).json({ error }));

};*/
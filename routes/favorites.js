const express = require('express')
const bodyParser = require('body-parser')
const favorites = require('../models/favorites')
const authenticate = require('../authenticate')
const cors = require('./cors')
const favoritesRouter = express.Router()
favoritesRouter.use(bodyParser.json())

favoritesRouter.route('/')

    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })

    .get(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
        console.log('use',req.user)
        favorites.find({ owner: req.user._id })
            .populate('owner')
            .populate('dishes')
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        console.log(req.body.user)
        favorites.findOne({ owner: req.user._id })
            .then((favorite) => {
                console.log('fav', req.user._id)
                console.log('fav', favorite == true)
                if (favorite) {
                    if (favorite.dishes.indexOf(req.body.dishes) == -1) {
                        favorite.dishes.push(req.body.dishes)
                        favorite.save()
                            .then((favorite) => {
                                favorites.findById(favorite._id)
                                    .populate('owner')
                                    .populate('dishes')
                                    .then((favorite) => {
                                        console.log('favorite added', favorite);
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(favorite);
                                    })
                                    .catch((err) => next(err));

                            })
                            .catch((err) => next(err));

                    } else {
                        err = new Error(req.body.dishes + 'is already a favorite');
                        return next(err)
                    }

                } else {
                    req.body.owner = req.user._id
                    console.log('favorite')
                    favorites.create(req.body)
                        .then((favorite) => {
                            favorites.findById(favorite._id)
                                .populate('owner')
                                .populate('dishes')
                                .then((favorite) => {
                                    console.log('favorite added', favorite);
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                                .catch((err) => next(err));
                        }, (err) => next(err))
                }
            })
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        favorites.findOneAndUpdate({ owner: req.user._id }, {
            $set: req.body
        }, { new: true })
            .then((favorite) => {
                    favorites.findById(favorite._id)
                        .populate('owner')
                        .populate('dishes')
                        .then((favorite) => {
                            console.log('favorite added', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch((err) => next(err));
                
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        favorites.findOneAndRemove({ owner: req.user._id })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });



favoritesRouter.route('/:favoritesId')

    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        favorites.findOne({ owner: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    if (favorite.dishes.indexOf(req.params.favoritesId) == -1) {
                        console.log('presence', favorite.dishes.indexOf(req.params.favoritesId))
                        favorite.dishes.push(req.params.favoritesId)
                        favorite.save()
                        .then((favorite) => {
                            favorites.findById(favorite._id)
                                .populate('owner')
                                .populate('dishes')
                                .then((favorite) => {
                                    console.log('favorite added', favorite);
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                                .catch((err) => next(err));

                        })
                        .catch((err) => next(err));

                    } else {
                        err = new Error(req.body.dishes + 'is already a favorite');
                        return next(err)
                    }

                } else {
                    req.body.owner = req.user._id
                    console.log('favorite')
                    favorites.create({ "owner": req.user._id, "dishes": req.params.favoritesId })
                        .then((favorite) => {
                                favorites.findById(favorite._id)
                                    .populate('owner')
                                    .populate('dishes')
                                    .then((favorite) => {
                                        console.log('favorite added', favorite);
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(favorite);
                                    })
                                    .catch((err) => next(err));

                           
                        }, (err) => next(err))
                }
            })
            .catch((err) => next(err));
    })


    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        favorites.findOne({ owner: req.user._id })
            .then((favorite) => {
                favorite.dishes = favorite.dishes.filter((dish) => dish != req.params.favoritesId)
                console.log(favorite.dishes)
                favorite.save()
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = favoritesRouter
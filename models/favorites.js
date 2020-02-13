
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const favoritesSchema = new Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
})


var Favorites = mongoose.model('Favorites', favoritesSchema);

module.exports = Favorites;
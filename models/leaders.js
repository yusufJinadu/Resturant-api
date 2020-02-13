const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const leaderSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
    description: {
        type: String,
        required: true
    },
    abbreviation:{
        type:String,
        default:false
    },
},{
    timestamps:true
})


var Leaders = mongoose.model('Leader', leaderSchema);

module.exports = Leaders ;
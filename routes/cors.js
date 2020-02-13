const express = require('express')
const cors = require('cors')
const app = express

const whitelist = ['http://localhost:3000','https://localhost:3443','http://DESKTOP-HE6LVBJ:3006','https://localhost:3006','http://localhost:3006']
var corsOptionsDelegate = (req,callback) => {
    var corsOptions;
    if(whitelist.indexOf(req.header('origin')) !== -1){
        corsOptions = {origin:true}
    }else{
        corsOptions = {origin:false}
    }
    callback(null, corsOptions)
}
exports.cors=cors()
exports.corsWithOptions = cors(corsOptionsDelegate)
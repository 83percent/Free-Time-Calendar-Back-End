const mongoose = require('mongoose');
const COLL_NAME = "client";

const ClientModel = mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    address : String,
    tel : {
        type: String,
        required: true
    },
    temp : {
        type: Number,
        required: true,
        min: 30,
        max: 45
    },
    reg_date : {
        type: Date,
        default : Date.now
    }
});

module.exports = mongoose.model(COLL_NAME, ClientModel);  
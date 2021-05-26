const mongoose = require('mongoose');
const COLL_NAME = "vote";

const VoteModel = mongoose.Schema({
    groupCode : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    start : {
        type: Date,
        required: true
    },
    end : {
        type: Date,
        required: true
    },
    reg_id : {
        type: String,
        required: true
    },
    minLength : {
        type: Number,
        required: true
    },
    agree : []
}, {
    versionKey: false
});

module.exports = mongoose.model(COLL_NAME, VoteModel);  
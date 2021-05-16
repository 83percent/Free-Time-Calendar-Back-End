const mongoose = require('mongoose');
const COLL_NAME = "free";

const FreeModel = mongoose.Schema({
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    },
    memo: {
        type: String
    },
    open: []
});

module.exports = mongoose.model(COLL_NAME, FreeModel);  
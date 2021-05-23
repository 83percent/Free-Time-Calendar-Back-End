const mongoose = require('mongoose');
const COLL_NAME = "schedule";

const ScheduleModel = mongoose.Schema({
    cate : {
        type: String,
        required : true
    },
    name : {
        type: String,
        required : true
    },
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
    }
});

module.exports = mongoose.model(COLL_NAME, ScheduleModel);  
const mongoose = require('mongoose');
const COLL_NAME = "schedule";

const ScheduleModel = mongoose.Schema({
    groupCode : {
        type: String,
        required : true
    },
    name : {
        type: String,
        required : true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    memo: {
        type: String
    },
    reg_id : {
        type: String,
        required: true
    },
    agree : []
});

module.exports = mongoose.model(COLL_NAME, ScheduleModel);  
const mongoose = require('mongoose');
const COLL_NAME = "user";

const UserMode = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    }
}, {
    versionKey: false
});

module.exports = mongoose.model(COLL_NAME, UserModel);  
/*
    We will apply MongoDB?
    or Mysql?
*/
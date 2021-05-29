const mongoose = require('mongoose');
const COLL_NAME = "user";

/* const FreeModel = mongoose.Schema({
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
}); */

const FreeCateModel = mongoose.Schema({
    cate : {
        type: String,
        required: true
    },
    list : [],
});

const UserModel = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    schedule : {
        type: Object
    }, 
    /*
        schedule : {
            'Y2021-M4' : [
                {
                    name : string,
                    start : Date,
                    end : Date,
                },
                {
                    name : 회의
                    start : 2021-04-21 08:30:00,
                    end : 2021-04-21 11:00:00
                },
                ...
            ]
        }
    */
    free : [FreeCateModel],
    /*
        free {
            'Y2021-M4' : [
                [start, end],
                [2021-04-03 11:30:00, 2021-04-03 17:00:00], 
                ...
            ]
        }
    */
   group : [],
   reg_date : {
       type : Date,
       default : Date.now()
   },
   alarm : []
}, {
    versionKey: false
});

module.exports = mongoose.model(COLL_NAME, UserModel);  
/*
    We will apply MongoDB?
    or Mysql?
*/
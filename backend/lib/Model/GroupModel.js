const mongoose = require('mongoose');
const COLL_NAME = "group";



// Vote of create schedule
const Vote = new mongoose.Schema({
    lessMember: {
        type: Number
    },
    date : [] // [start, end]
})

const GroupModel = new mongoose.Schema({
    admin : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    group : [], // :user._id
    ban : [], // 차단된 계정
    wait : [], // group에 들어가기전 admin이 허용해주기 전까지 대기 하는 곳
    /*
        wait : [
            [id, name]
        ]
    */
    vote : [],
    open : {
        type: Boolean,
        default: true
    },
    schedule : [],
    reg_date : {
        type: Date,
        default: Date.now()
    }
}, {
    versionKey: false
});

module.exports = mongoose.model(COLL_NAME, GroupModel);
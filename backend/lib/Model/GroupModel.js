const mongoose = require('mongoose');
const COLL_NAME = "group";

const GroupModel = new mongoose.Schema({
    admin : {
        type: String,
        require: true
    },
    group : [], // :user._id
    ban : [], // 차단된 계정
    wait : [], // group에 들어가기전 admin이 허용해주기 전까지 대기 하는 곳
    /*
        wait : [
            [id, name]
        ]
    */
    open : {
        type: Boolean,
        default: true
    },
    reg_date : {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model(COLL_NAME, GroupModel);
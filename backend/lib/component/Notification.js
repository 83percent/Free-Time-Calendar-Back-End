const UserModel = require("../Model/UserModel");


const validTypes = ["schedule", "group", "vote"];
/*
    @param id       : 저장할 유저의 id
    @param access   : 알람과 연결된 정보의 id
    @param type     : 어떤 타입의 알람인지.
    @param message1 : 정보1
    @param message2 : 정보2
*/
async function set(id, access, type, message1, message2) {
    const user = await UserModel.findById(id, ["alarm"]);
    if(validTypes.includes(type)) {
        if(message2 != null) user.alarm.push({type, message1, message2, access});
        else user.alarm.push({type, message1, access});
        await user.save();
    }

    return false;
}


module.exports = { set }
/*
    String type, emssage1, message2, access
*/
const UserModel = require("../Model/UserModel");

const alarmTypes = ["schedule", "group", "vote"];

async function addAlarm(id, type, message1, message2, access) {
    if(!alarmTypes.includes(type)) return false;
    try {
        
        const user = await UserModel.findById(id, ["alarm"]);
        user.alarm.push({ type, message1, message2, access });
        await user.save();
        return true;
    } catch {
        return false;
    }
}


async function getAlarm(id) {
    const {alarm} = await UserModel.findById(id, ["alarm"]);
    return alarm;
}

async function deleteAlarm(id) {
    try {
        const user = await UserModel.findById(id, ["alarm"]);
        if(user.alarm?.length > 0) {
            user.alarm = [];
            await user.save();
            return true;
        }
    } catch {
        return false;
    }
}
module.exports = {
    addAlarm, getAlarm
}
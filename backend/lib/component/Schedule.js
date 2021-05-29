const UserModel = require("../Model/UserModel");
const ScheduleModel = require("../Model/ScheduleModel");
const GroupModel = require("../Model/GroupModel");

async function get(id, date) {
    const user = await UserModel.findById(id, ["schedule"]);
    if(!user) return null;
    else {
        let cateObj = null;
        for(const cate of user.schedule) {
            if(date == cate.cate) {
                cateObj = cate.list;
                break;
            }
        }
        if(cateObj == null) return [];
        else return cateObj;
    }
}
async function set(id ,data) {
    try {
        const {name, memo ,sYear, sMonth, sDay, sHour, sMin, eYear, eMonth, eDay, eHour, eMin} = data;
        const cate = `Y${sYear}-M${sMonth}`;
        const schedule = new ScheduleModel({
            cate, name, memo,
            start: `${sYear}-${sMonth}-${sDay} ${sHour}:${sMin}`,
            end: `${eYear}-${eMonth}-${eDay} ${eHour}:${eMin}`
        });
        const {_id} = await schedule.save();
        console.log("추가된 스케줄 데이터 : ", _id);
        if(!_id) return 'error';
        else {
            const user = await UserModel.findById(id, ["schedule"]);
            if(!user.schedule[cate]) user.schedule[cate] = new Array();
            user.schedule[cate].push(_id);
            user.save();
        }
    } catch {return 'error';}
    
    const user = await UserModel.findById(id, ["schedule"]);

    if(!user) return null;
    else {
        
        
        try {
            let cateObj = null;
            for(const cate of user.schedule) {
                if(dateCate == cate.cate) {
                    cateObj = cate.list;
                    break;
                }
            }
            if(cateObj == null) {
                user.schedule.push({
                    cate : dateCate,
                    list : [insertData]
                });
            } else {
                cateObj.push(insertData);
            }
            await user.save();
            return insertData._id;
            
        } catch(e) {
            console.log(e);
            return false;
        }
    }
}

async function remove(id, date, scheduleID) {
    const user = await UserModel.findById(id, ["schedule"]);
    if(!user) return null;
    else if(!user.schedule || user.schedule.length == 0) return [];
    else {
        for(const cate of user.schedule) {
            if(cate == date) {
                await cate.list.findById(scheduleID);
                
                break;
            }
        }
    }
}

async function getUser(id) {
    const user = await UserModel.findById(id, ["schedule"]);
    if(!user) return null;
    else return user;
}

/*
    Group
*/
// 그룹 목록 스케줄 목록
async function get(groupCode) {
    const {schedule} = await GroupModel.findById(groupCode, ["schedule"]);
    if(!schedule || schedule?.length == 0) return [];
    
    for(const _sid of schedule) {
        const _s = await ScheduleModel.findById(_sid);
    }
}

// 투표 후 자동으로 연결
async function setGroupSchedule(voteData) {
    const {_id, groupCode, name, memo, start, end, reg_id, agree} = voteData;
    const schedule = new ScheduleModel({
        groupCode, name, memo, start, end, reg_id, participant : agree
    });

    const _s = await schedule.save();
    if(!_s._id) return null;

    const group = await GroupModel.findById(groupCode, ["name","schedule","vote"]);
    group.vote.splice(group.vote.indexOf(_id), 1);
    group.schedule.push(_s._id);
    await group.save();

    for(const agreeID of agree) {
        const user = await UserModel.findById(agreeID, ["schedule", "alarm"]);
        console.log("검색 유저 : ",user)
        if(!user?.schedule) user.schedule = new Object();
        if(!user.schedule[`${start.getFullYear()}-${start.getMonth()}`]) user.schedule[`${start.getFullYear()}-${start.getMonth()}`] = new Array();
        user.schedule[`${start.getFullYear()}-${start.getMonth()}`].push(_s._id);
        if(!user.alarm) user.alarm = new Array();
        user.alarm.push({
            type: "newSchedule",
            groupName : group.name,
            scheduleName: name
        });
        await user.save();
    }
    return true;
}

async function getGroupSchedule(groupCode) {
    return await ScheduleModel.find({groupCode, start : {$lte : new Date()}})
}
module.exports = {
    get,
    set,
    remove,

    getGroupSchedule,
    setGroupSchedule
}
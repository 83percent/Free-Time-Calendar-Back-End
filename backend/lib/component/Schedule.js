const UserModel = require("../Model/UserModel");
const ScheduleModel = require("../Model/ScheduleModel");
const GroupModel = require("../Model/GroupModel");
const { find } = require("../Model/ScheduleModel");

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
async function getGroupScheduleForMonth(groupCode, year, month) {
    year = parseInt(year);
    month = parseInt(month);
    const _s = new Date(`${year}/${month}/1 00:00`);
    const _e = month == 12 ? new Date(`${year+1}/1/1 00:00`) : new Date(`${year}/${month+1}/1 00:00`);

    return await ScheduleModel.find({groupCode, start : {$gte : _s, $lt : _e}});
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
    const schedules = await ScheduleModel.find({groupCode, start : {$gte : Date.now()}});
    if(!schedules || schedules.length == 0) return null;

    const d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    
    return schedules.reduce((acc, element) => {
        let {start, end} = element;
        start = new Date(start);
        end = new Date(end);
        const _start = `${start.getFullYear()}-${start.getMonth()+1}-${start.getDate()} ${start.getHours()}:${start.getMinutes()}`;
        const _end = `${end.getFullYear()}-${end.getMonth()+1}-${end.getDate()} ${end.getHours()}:${end.getMinutes()}`;

        const _sD = new Date(element.start);
        _sD.setHours(0);
        _sD.setMinutes(0);
        const gap = d.getTime() - _sD.getTime();
        acc.push({
            name : element.name,
            start : _start, end : _end,
            memo : element.memo,
            dday : Math.floor(gap / (1000 * 60 * 60 * 24))
        });
        return acc;
    }, []).sort((a,b) => {
        return b.dday - a.dday;
    });
}
module.exports = {
    get,
    set,
    remove,

    getGroupSchedule,
    setGroupSchedule,
    getGroupScheduleForMonth
}
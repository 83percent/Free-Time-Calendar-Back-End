const UserModel = require("../Model/UserModel");
const ScheduleModel = require("../Model/ScheduleModel");

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


module.exports = {
    get,
    set,
    remove
}
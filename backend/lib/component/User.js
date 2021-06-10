const UserModel = require('../Model/UserModel');
const ScheduleModel = require("../Model/ScheduleModel");
const bcrypt = require('bcrypt');
const saltRounds = 10;
/*
    로그인
    @param email    :String
    @param password :String

    @return _id     :String     로그인 성공
    @return null    :NULL       로그인 실패
*/
async function login(email, password) {
    
    try {
        const user = await UserModel.findOne({email: email}, ['password', 'name']);
        if(!user) {return null} // 등록된 회원 없음
        else {
            return await bcrypt.compare(password, user.password) ? {_id : user._id, name : user.name} : null;
        }
    } catch(err) {console.log(err); return 'error';}
}

async function get(id) {
    try {
        const user = await UserModel.findById(id, ['name']);
        if(!user) {return null} // 등록된 회원 없음
        else {
            return {email: user.email, name: user.name};
        }
    } catch(err) {console.log(err); return 'error';}
}

/*
    회원가입
    @param email :String
    @param password :String
    @param name :String

    @return 1   성공
    @return 0   중복
    @return -1  에러
*/
async function set(email, password, name) {
    try {
        let user = await UserModel.findOne({email: email});
        if(user?._id) return 0; // 이미 존재하는 아이디
        else {
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);
            user = new UserModel({
                email: email,
                password : hash,
                name : name
            });
            await user.save();
            return 1;
        }
    } catch(err) {console.log(err); return -1;}
}
async function remove(id) {
    try {
        let user = await UserModel.findByIdAndRemove(id);
        if(user) return true;
        else return false;
    } catch(err) {console.log(err); return 'error';}
}
async function updateName(id, name) {
    try {
        let user = await UserModel.findById(id, ['name']);
        if(!user) return null;
        else {
            user.name = name;
            await user.save();
            return true;
        }
    } catch(err) {console.log(err); return 'error';}
}
async function updatePassword(id, password) {
    try {
        let user = await UserModel.findById(id, ['password']);
        if(!user) return null;
        else {
            user.password = password;
            await user.save();
            return true;
        }
    } catch(err) {console.log(err); return 'error';}
}
async function update(id, name, password) {
    try {
        let user = await UserModel.findById(id, ['name', 'password']);
        if(!user) return null;
        else {
            user.password = password;
            user.name = name;
            await user.save();
            return true;
        }
    } catch(err) {console.log(err); return 'error';}
}

async function getTimes(id, year, month) {
    const user = await UserModel.findById(id, ['free', 'schedule']);
    const date = `Y${year}-M${month}`;
    const result = [];
    
    for(const free of user.free) {
        if(free.cate == date) {
            for(const element of free.list) {
                const start = new Date(element.start);
                const end = new Date(element.end);
                result.push({
                    sYear : start.getFullYear(),
                    sMonth : start.getMonth()+1, 
                    sDay : start.getDate(), 
                    sHour : start.getHours(), 
                    sMin : start.getMinutes(),
                    eYear : end.getFullYear(), 
                    eMonth : end.getMonth()+1, 
                    eDay : end.getDate(), 
                    eHour : end.getHours(), 
                    eMin : end.getMinutes(),
                    code : element._id, 
                    type : "free"
                });
            }
            break;
        }
    }
    console.log(user.schedule)
    for(const schedule of user.schedule) {
        if(schedule.cate == date) {
            for(const element of schedule.list) {
                const data = await ScheduleModel.findById(element);
                const start = new Date(data.start);
                const end = new Date(data.end);
                result.push({
                    sYear : start.getFullYear(),
                    sMonth : start.getMonth()+1, 
                    sDay : start.getDate(), 
                    sHour : start.getHours(), 
                    sMin : start.getMinutes(),
                    eYear : end.getFullYear(), 
                    eMonth : end.getMonth()+1, 
                    eDay : end.getDate(), 
                    eHour : end.getHours(), 
                    eMin : end.getMinutes(),
                    code : element._id, 
                    type : "schedule"
                });
            }
            break;
        }
    }
    /* if(user.schedule[`${year}-${month}`]) {
        for(const element of user.schedule[`${year}-${month}`]) {
            const schedule = await ScheduleModel.findById(element);
            const start = new Date(schedule.start);
            const end = new Date(schedule.end);
            result.push({
                sYear : start.getFullYear(),
                sMonth : start.getMonth()+1, 
                sDay : start.getDate(), 
                sHour : start.getHours(), 
                sMin : start.getMinutes(),
                eYear : end.getFullYear(), 
                eMonth : end.getMonth()+1, 
                eDay : end.getDate(), 
                eHour : end.getHours(), 
                eMin : end.getMinutes(),
                code : element, 
                type : "schedule"
            });
        }
    } */
    return result;
}

async function getDateTime(id, year, month, day) {
    
    const user = await UserModel.findById(id, ["free", "schedule"]);
    const date = `Y${year}-M${month}`;
    const result = [];
    console.log(`${date}-D${day}`);
    // Free
    for(const element of user.free) {
        if(element.cate == date) {
            for(const list of element.list) {
                const start = new Date(list.start);
                if(start.getDate() == day) {
                    const end = new Date(list.end);
                    result.push({
                        sHour : start.getHours(),
                        sMin : start.getMinutes(),
                        eHour : end.getHours(),
                        eMin : end.getMinutes(),
                        type : "free"
                    })
                }
            }
            break;
        }
    }

    // schedule
    for(const element of user.schedule) {
        if(element.cate == date) {
            for(const list of element.list) {
                const schedule = await ScheduleModel.findById(list, ["name","start", "end"]);
                const start = new Date(schedule.start);
                if(start.getDate() == day) {
                    const end = new Date(schedule.end);
                    result.push({
                        name : schedule.name,
                        sHour : start.getHours(),
                        sMin : start.getMinutes(),
                        eHour : end.getHours(),
                        eMin : end.getMinutes(),
                        type : "schedule"
                    });
                }
            }
            break;
        }
    }
    return result.sort((a,b) => {
        return a.sHour - b.sHour;
    })
}
module.exports = {login, get, set, remove, update, updateName, updatePassword, getTimes, getDateTime};
const UserModel = require("../Model/UserModel");
const FreeModel = require("../Model/FreeModel");
const GroupModel = require("../Model/GroupModel");

async function set(id, data) {
    const user = await UserModel.findById(id);
    const {sYear, sMonth, sDay, sHour, sMin, eYear, eMonth, eDay, eHour, eMin} = data;
    if(!user?._id) return null;
    else {
        const dateCate = `Y${sYear}-M${sMonth}`;
        const insertData = new FreeModel({
            start: `${sYear}-${sMonth}-${sDay} ${sHour}:${sMin}`,
            end: `${eYear}-${eMonth}-${eDay} ${eHour}:${eMin}`
        })
        try {
            let cateObj = null;
            for(const cate of user.free) {
                if(dateCate == cate.cate) {
                    cateObj = cate.list;
                    break;
                }
            }
            if(cateObj == null) {
                user.free.push({
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
/*
    @param id :String       그룹의 고유 코드
    @param year :String     찾고자하는 날짜
    @param month :String     찾고자하는 날짜
    @param day :String     찾고자하는 날짜
*/
async function getGroupFree(groupCode, year, month, day) {
    const {group} = await GroupModel.findById(groupCode, ["group"]);
    if(!group || group.length == 0) return null;

    const resultArr = [];
    for(const id of group) {
        const user = await UserModel.findOne({_id : id, 'free.cate' : `Y${year}-M${month}`})
        if(user) {
            for(const cate of user.free) {
                if(cate.cate == `Y${year}-M${month}`) {
                    let elements = [];
                    for(const data of cate.list) {
                        if(new Date(data.start).getDate() == day) {
                            elements.push({
                                start : data.start,
                                end : data.end
                            });
                        }
                    }
                    if(elements.length > 0) {
                        resultArr.push({
                            name : user.name,
                            elements
                        });
                    }
                    break;
                }
            }
        }
    }
    return resultArr;
}

module.exports = {
    set,
    getGroupFree
}
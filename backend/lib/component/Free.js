const UserModel = require("../Model/UserModel");
const FreeModel = require("../Model/FreeModel");

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

module.exports = {
    set
}
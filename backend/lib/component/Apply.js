const GroupModel = require('../Model/GroupModel');
const UserModel = require('../Model/UserModel');

/*
    그룹 참여 신청자 목록 받아오기
    @param groupCode :string    그룹 고유 id
    @param admin     : 요청한 그룹의 admin 고유코드

    @return null    : 해당 groupCode 에 해당하는 Group 데이터 없음
    @return false   : admin 불일치
    @return [array : String]   : success
*/
async function get(groupCode, admin) {
    try {
        const group = await GroupModel.findById(groupCode, ['admin', 'wait']);
        if(!group) return null;
        else {
            if(group.admin != admin) return false;
            else return group.wait;
        }
    } catch(err) {console.log(err); return 'error';}   
}
/*
    사용자 그룹에 참여 요청.
    @param groupCode :string    그룹 고유 id
    @param applier     : 그룹에 참여할 참여자 고유 코드

    @return null    : 해당 groupCode 에 해당하는 Group 데이터 없음
    @return 'error'   : 실패
    @return true    : 성공
*/  
async function add(groupCode, applier) {
    try {
        const group = await GroupModel.findById(groupCode, ['admin', 'wait']);
        if(!group) return null;
        else {
            if(group.wait.includes(applier)) return true;
            else {
                group.wait.push(applier);
                await group.save().exec();
                return true;
            }
        }
    } catch(err) {console.log(err); return 'error';}   
}

async function accept(groupCode, applierID) {
    const group = await GroupModel.findById(groupCode, ["wait","group"]);
    const user = await UserModel.findById(applierID, ["group"]);
    if(!group || !user) return null;
    
    if(group.wait.indexOf(applierID) != -1) {
        group.wait.splice(group.group.indexOf(applierID), 1);
        group.group.push(applierID);
        await group.save();
        if(user.group.indexOf(groupCode) == -1) {
            user.group.push(groupCode);
            await user.save();
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
async function reject(groupCode, applierID) {
    const group = await GroupModel.findById(groupCode, ["wait","group"]);
    if(!group) return null;
    if(group.wait.indexOf(applierID) != -1) {
        group.wait.splice(group.group.indexOf(applierID), 1);
        group.group.push(applierID);
        await group.save().exec();
        return true;
    } else {
        return false;
    }
}
module.exports = {
    get, add, accept, reject
}
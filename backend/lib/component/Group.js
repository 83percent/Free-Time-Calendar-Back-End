const GroupModel = require('../Model/GroupModel');
const UserModel = require('../Model/UserModel');

const Notification  = require("./Notification");

// 그룹 만들기
/*
    @param id:string 최초 생성자 고유 id
*/
async function create(id, name) {
    try {
        const group = new GroupModel({
            admin: id,
            name: name,
            group: [id]
        });
        const result = await group.save();

        const user = await UserModel.findById(id);
        user.group.push(result._id);
        await user.save();

        // ADD ALARM
        Notification.set(id, result._id, 'group', name);

        return result._id;
    } catch(err) {console.log(err); return 'error';}
}
/*
    open(groupCode, id, boolean)
    링크로 Group 참여 허용 속성 변경

    @param groupCode :string    그룹 고유 id
    @param id :string           admin 요청 id
    @param boolean :boolean     변경하려는 속성

    @return null    그룹데이터를 찾을 수 없음
    @return false   admin 불일치 - 변경 불가
    @return true    변경성공
*/
async function open(groupCode, id, boolean) {
    try {
        const group = await GroupModel.findById(groupCode, ['admin','open']);
        if(!group) return null;
        else {
            if(group.admin != id) return false;
            else {
                group.open = boolean;
                await group.save();
                return true;
            }
        }
    } catch(err) {console.log(err); return 'error';}
}
/*
    apply(id)
    유저를 Group 대기열에 추가

    @param groupCode :string    그룹 고유 id
    @param id :string           await에 추가하려는 id

    @return null    그룹데이터를 찾을 수 없음
    @return -1   차단된 계정
    @return 0 이미 대기열에 추가됨 : 성공이나 다름없음
    @return 1 대기열에 추가성공
*/
async function apply(groupCode, id) {
    try {
        const group = await GroupModel.findById(groupCode, ['group','wait', 'ban']);
        if(!group) return null;
        else {
            if(group.ban.length != 0 && group.ban.indexOf(id) != -1) return -2; 
            else {
                if(group.group.indexOf(id) != -1 ) return 0;
                else if(group.wait.indexOf(id) != -1) return -1
                group.wait.push(id);
                await group.save();
                return 1;
            }
        }
    } catch(err) {console.log(err); return 'error';}
} // apply

async function getApplyList(groupCode) {
    try {
        const {wait} = await GroupModel.findById(groupCode, ["wait"]);
        console.log(wait);
        if(wait) {
            if(wait.length == 0) return [];
            else {
                let resultArr = [];
                for(const id of wait) {
                    const {name} = await UserModel.findById(id, ["name"]);
                    resultArr.push({id, name});
                }
                console.log("결과 : ", resultArr);
                return resultArr;
            }
        } else return [];
    } catch(err) {console.log(err); return 'error';}
} // getApplyList

/*
    ban(groupCode, adminId, banId)
    @param groupCode    그룹 고유코드
    @param adminID      요청한 admin 고유코드
    @param banID        차단할 계정 고유코드

    @return null        그룹 데이터 찾을 수 없음
    @return false       권한 없음
    @return true        차단됨
*/
async function ban(groupCode, adminID, banID) {
    try {
        const group = await GroupModel.findById(groupCode, ['admin', 'group', 'await', 'ban']);
        if(!group) return null;
        else {
            if(group.admin != adminID) return false;
            else {
                if(group.ban.indexOf(banID) != -1) return true;
                else {
                    admin
                }
            }
        }
    } catch(err) {console.log(err); return 'error';}   
}

/*
    getGroupList(admin, groupCode)
    @param groupCode    그룹 고유코드
    @param admin        요청한 admin 고유코드

    @return false       권한 없음
    @return [...]       성공
*/
async function getGroupList(groupCode) {
    try {
        const {group} = await GroupModel.findById(groupCode, ['group']);
        console.log("요청 그룹 리스트 : ", group)
        if(!group || group.length == 0) return null;
        else {
            const result = [];
            try {
                for(const id of group) {
                    
                    const member = await UserModel.findById(id, ["_id", "name"]);
                    result.push({
                        id : member._id,
                        name : member.name
                    });
                }
                console.log("참여자 목록 : ", result)
                return result;
            } catch(e) {
                console.log(e);
                return null;
            }
        }
    } catch(err) {console.log(err); return false;}
}

async function changeAdmin(groupCode, admin) {
    try {
        const group = await GroupModel.findById(groupCode, ['admin']);
        if(!group.admin) return null;
        else if(group.admin != admin[0]) return false;
        else {
            group.admin = admin[1];
            await group.save();
            return true;
        }
    } catch(err) {console.log(err); return 'error';}
}

async function outOfGroup(groupCode, id) {
    try {
        const group = await GroupModel.findById(groupCode, ['group', 'admin']);
        let index = -1;

        if(group.group.length > 1) {
            index = group.group.indexOf(id);
            if(index == -1) return null;
            else {
                group.group.splice(index, 1);

                if(group.admin == id) {
                    // 그룹 관리자가 나갔을 경우 다음 사람에게 관리자 위임
                    group.admin = group.group[0];
                }
                group.save();
            }
        } else {
            await GroupModel.findByIdAndDelete(groupCode);
        }

        const user = await UserModel.findById(id, ["group"]);
        console.log(user.group.splice(user.group.indexOf(groupCode), 1));
        await user.save();
        return true;
    } catch(err) {console.log(err); return 'error';}
}


async function getUserGroupInfo(id) {
    const user = await UserModel.findById(id);
    const groups = user?.group;
    if(!groups || groups.length == 0) return 0;
    else {
        try {
            const returnArr = [];
            for(const id of groups) {
                const group = await GroupModel.findById(id);
                console.log(group);
                returnArr.push({
                    id : group._id,
                    name : group.name,
                    admin : group.admin,
                    scheduleCount : group.schedule.length,
                    memberCount : group.group.length
                })
            }
            return returnArr;
        } catch(e) {
            console.log(e);
            return null
        }
        
    }
}
module.exports = {
    create, open, 
    apply, getApplyList, // Apply
    getGroupList, changeAdmin, outOfGroup, getUserGroupInfo}
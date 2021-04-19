const GroupModel = require('../Model/GroupModel');

// 그룹 만들기
/*
    @param id:string 최초 생성자 고유 id
*/
async function create(id) {
    try {
        const group = new GroupModel({
            admin: id,
            group: [id]
        })
        await group.save();
        return true;
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
        const group = await GroupModel.findById(groupCode, ['wait', 'ban']);
        if(!group) return null;
        else {
            if(group.ban.length != 0 && group.ban.indexOf(id) != -1) return -1; 
            else {
                if(group.wait.indexOf(id) != -1) return 0;
                group.wait.push(id);
                await group.save();
                return 1;
            }
        }
    } catch(err) {console.log(err); return 'error';}
} // apply

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
async function getGroupList(admin, groupCode) {
    try {
        const group = await GroupModel.findById(groupCode, ['admin', 'group']);
        if(!group.admin || group.admin != admin) return false;
        else {
            return group;
        }
    } catch(err) {console.log(err); return 'error';}
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
        const group = await GroupModel.findById(groupCode, ['group']);
        if(!group || group.group.indexOf(id) == -1) return null;
        else {
            group.group.slice()
        }
    } catch(err) {console.log(err); return 'error';}
}
module.exports = {create, open, apply, getGroupList, changeAdmin, outOfGroup}
const GroupModel = require('../Model/GroupModel');
const UserModel = require('../Model/UserModel');


async function getBanList(groupCode) {
    try {
        const {ban} = await GroupModel.findById(groupCode, ['ban']);
        if(!ban || ban.length == 0) return null;
        else {
            const result = [];
            try {
                for(const id of ban) {
                    
                    const member = await UserModel.findById(id, ["_id", "name"]);
                    result.push({
                        id : member._id,
                        name : member.name
                    });
                }
                return result;
            } catch(e) {
                console.log(e);
                return null;
            }
        }
    } catch(err) {console.log(err); return false;}
}

module.exports = {getBanList}
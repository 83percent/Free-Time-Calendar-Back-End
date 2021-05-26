const VoteModel = require("../Model/VoteModel");
const GroupModel = require("../Model/GroupModel");

const Time = require("../ChangeTimezone");

async function addVote(groupCode, reg_id ,name, start, end, minLength) {
    const vote = new VoteModel({
        groupCode, name, reg_id,
        minLength : parseInt(minLength),
        start : new Date(start), // new Date(start+"+00:00")
        end : new Date(end)
    });

    const result = await vote.save();
    if(!result) return null;
    
    const group = await GroupModel.findById(groupCode, ["vote"]);
    if(!group) return null;
    
    group.vote.push(result._id);
    await group.save();

    return result;
}



module.exports = {
    addVote
}
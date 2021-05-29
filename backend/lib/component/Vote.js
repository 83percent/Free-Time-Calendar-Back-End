const VoteModel = require("../Model/VoteModel");
const GroupModel = require("../Model/GroupModel");

const Time = require("../ChangeTimezone");
const Alarm = require("./Alarm");
const Schedule = require("./Schedule");

async function addVote(groupCode, reg_id ,name, start, end, minLength, memo) {
    const vote = new VoteModel({
        groupCode, name, reg_id, memo,
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

async function getVoteList(groupCode) {
    const {vote} = await GroupModel.findById(groupCode, ["vote"]);
    console.log(vote);
    if(!vote || vote?.length == 0) return [];
    let resultArr = [];
    for(const voteID of vote) {
        const {_id, agree, name, memo, start, end, minLength} = await VoteModel.findById(voteID);
        if(_id) resultArr.push({
            _id, name, memo, agree, minLength,
            start : `${start.getFullYear()}-${start.getMonth()+1}-${start.getDate()} ${start.getHours()}:${start.getMinutes()}`,
            end : `${end.getFullYear()}-${end.getMonth()+1}-${end.getDate()} ${end.getHours()}:${end.getMinutes()}`
        });
    }
    return resultArr;
}

async function vote(voteCode, id, agree) {
    const _v = await VoteModel.findById(voteCode, ["agree"]);
    try {
        if(agree) {
            if(_v.agree.indexOf(id) == -1) {
                _v.agree.push(id);
                await _v.save();
            }
            return true;
        } else {
            if(_v.agree.indexOf(id) != -1) {
                _v.agree.splice(_v.agree.indexOf(id), 1);
                await _v.save();
            }
            return true;
        }
    } catch {
        return false;
    }
}

async function getVoteForMonth(groupCode, year, month) {
    console.log("시작 날짜", new Date(year,month-1, 1));
    console.log("끝 날짜", new Date(year,month, 1));

    const vote = await VoteModel.find({groupCode, start : {
        $gte : new Date(year,month-1, 1),
        $lt : new Date(year, month, 0)}
    });
    return vote;
}

async function completeVote(voteCode) {
    const vote = await VoteModel.findByIdAndDelete(voteCode);
    console.log(vote);
    if(!vote) return null;
    else {
        if(await Schedule.setGroupSchedule(vote) != null) {
            return vote;
        } else return false;
    }
}

module.exports = {
    addVote, getVoteList, vote, getVoteForMonth,
    completeVote,
}
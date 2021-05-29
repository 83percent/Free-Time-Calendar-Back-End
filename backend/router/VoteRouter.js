const express = require('express');
const Vote = require('../lib/component/Vote');
const StatusCode = require('../lib/Status-code/StatusCode');
const router = express.Router();

router.post("/:voteCode", async (req, res) => {
    const voteCode = req.params?.voteCode;
    const {id, agree} = req.body;
    if(!id && agree == undefined) res.status(StatusCode.invalid);
    else {
        const result = await Vote.vote(voteCode, id, agree);
        if(result) res.send("true");
        else res.sendStatus(500);
    }
});
router.get("/:groupCode/:year/:month", async (req,res) => {
    const {groupCode, year, month} = req.params;

    const result = await Vote.getVoteForMonth(groupCode, year, month);
});

router.post("/complete/:voteCode", async(req, res) => {
    const voteCode = req.params?.voteCode;
    const result = await Vote.completeVote(voteCode);
    if(result) res.send(result);
    else if(result == null) res.sendStatus(StatusCode.nodata);
    else res.sendStatus(500);
});
module.exports = router;
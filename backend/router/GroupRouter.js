const express = require('express');
const router = express.Router();
const StatusCode = require("../lib/Status-code/StatusCode");

const Group = require('../lib/component/Group');
const Apply = require('../lib/component/Apply');
const Ban = require('../lib/component/Ban');
const Free = require('../lib/component/Free');
const Vote = require('../lib/component/Vote');
const Schedule = require('../lib/component/Schedule');
// Group 생성
/*
    @return 200 성공
    @return 412 요청 형식 일치하지 않음
    @return 500 서버오류
*/
router.post("/", async (req, res) => {
    const {admin, name} = req.body;

    if(!admin || !name) res.sendStatus(StatusCode.invalid);     // 412
    else {
        const result = await Group.create(admin, name);
        if(result == 'error') res.sendStatus(StatusCode.error); // 500
        else res.send(result); // 200
    }
});
/*
    사용자 그룹 정보 받기 : group 의 list view 완성을 위해
*/
router.get("/list/:id", async (req, res) => {
    const id = req.params.id;
    console.log("id : ", id);
    if(!id) res.sendStatus(StatusCode.invalid); // 412
    else {
        const result = await Group.getUserGroupInfo(id);
        console.log(result);
        if(result) res.send(result);
        else {
            switch(result) {
                case 0 : {
                    res.sendStatus(StatusCode.nodata);
                    break;
                }
                case null :
                default : {
                    res.sendStatus(StatusCode.error);
                }
            }
        }
    }
})

// Group member 받아오기
/*
    @return 200 성공
    @return 204 권한 없음
    @return 401 요청 형식 일치하지 않음
    @return 500 서버오류
*/
router.get("/member/:GroupCode", async (req, res) => {
    const groupCode = req.params.GroupCode;
    console.log(groupCode);
    const result = await Group.getGroupList(groupCode); 
    console.log(result);
    if(result) res.status(200).send(result);
    else {
        switch(result) {
            case null : {
                res.status(StatusCode.nodata);
                break;
            }
            case false :
            default : {
                res.status(StatusCode.error);
            }
        }
    }
});
/*
    Group open 속성 변경

    @return 200 성공
    @return 204 권한 없음
    @return 401 요청 형식 일치하지 않음
    @return 404 그룹 데이터 없음
*/
router.patch("/:GroupCode", async (req, res) => {
    const admin = req.body.admin;
    const groupCode = req.params.GroupCode;
    const open = req.body.mode;
    if(!groupCode || !admin || open == undefined) res.sendStatus(401);
    else {
        const result = await Group.open(groupCode, admin, open);
        switch(result) {
            case true : {
                res.sendStatus(200);
                break;
            }
            case false : {
                res.sendStatus(204);
                break;
            }
            case null : {
                res.sendStatus(404);
                break;
            }
            case 'error' :
            default : {
                res.sendStatus(500);
            }
        }
    }
});

/*
    Group 관리자 변경
    @return 200 성공
    @return 204 권한 없음
    @return 401 요청 형식 일치하지 않음
    @return 404 그룹 데이터 없음
*/
router.put("/:GroupCode", async (req, res) => {
    const admin = req.body.admin;
    const groupCode = req.params.GroupCode;
    if(!groupCode || !admin) res.sendStatus(401);
    else {
        const result = await Group.changeAdmin(groupCode, admin);
        switch(result) {
            case true : {
                res.sendStatus(200);
                break;
            }
            case false : {
                res.sendStatus(204);
                break;
            }
            case null : {
                res.sendStatus(404);
                break;
            }
            case 'error' :
            default : {
                res.sendStatus(500);
            }
        }
    }
});

/*
    Group 에서 탈퇴
    @return 200 성공
    @return 204 권한 없음
    @return 401 요청 형식 일치하지 않음
    @return 404 그룹 데이터 없음
*/
router.delete("/:GroupCode", async (req, res) => {
    const id = req.body.id;
    const groupCode = req.params?.GroupCode;
    if(!groupCode || !id) res.status(401).send('-2');
    else {
        const result = await Group.outOfGroup(groupCode, id);
        console.log(result);
        switch(result) {
            case true : {
                res.status(200).send("1");
                break;
            }
            case null : {
                res.status(404).send("0");
                break;
            }
            case 'error' :
            default : {
                res.status(500).send("-1");
            }
        }
    }
});

/*
=======================
        Apply
=======================
*/
router.get("/apply/list/:GroupCode", async (req, res) => {
    const code = req.params?.GroupCode;
    if(!code) res.status(StatusCode.invalid).send("-1"); // 412
    else {
        const result = await Group.getApplyList(code);
        if(result != 'error') res.send(result);
        else res.status(StatusCode.error).send("-2");
    }
});

// 그룹 참여 신청
router.post("/apply/:GroupCode", async(req, res) => {
    const code = req.params?.GroupCode;
    const id = req.body?.id;
    if(!code || !id) res.sendStatus(StatusCode.invalid); // 412
    else {
        const result = await Group.apply(code, id);
        if(result != null) res.send(`${result}`);
        else if(result == 'error') res.sendStatus(StatusCode.error); // 500
        else if(result == null) res.sendStatus(StatusCode.nodata); // 404
    }
});

// 그룹 참여 신청 허용
router.post("/apply/list/:GroupCode", async (req, res) => {
    const code = req.params?.GroupCode;
    const id = req.body?.id;
    if(!code || !id) res.sendStatus(StatusCode.invalid); // 412
    else {
        const result = await Apply.accept(code, id);
        switch(result) {
            case true : {
                res.send("1"); // 200
                break;
            }
            case false : {
                res.status(StatusCode.nodata); // 404
            }
            default : {
                res.status(StatusCode.error); // 500
            }
        }
    }
});
// 그룹 참여 신청 거절
router.delete("/apply/list/:GroupCode", async (req, res) => {
    const code = req.params?.GroupCode;
    const id = req.body?.id;
    if(!code || !id) res.sendStatus(StatusCode.invalid); // 412
    else {
        const result = await Apply.reject(code, id);
        switch(result) {
            case true : {
                res.send("1"); // 200
                break;
            }
            case false : {
                res.status(StatusCode.nodata); // 404
            }
            default : {
                res.status(StatusCode.error); // 500
            }
        }
    }
});

/*
=======================
        Ban
=======================
*/
router.get("/apply/ban/:GroupCode", async (req, res) => {
    const code = req.params?.GroupCode;
    if(!code) res.status(StatusCode.invalid).send("-1"); // 412
    else {
        const result = await Ban.getBanList(code);
        if(result != 'error') res.send(result);
        else res.status(StatusCode.error).send("-2");
    }
});

/*
=============================
        Free & Schedule
=============================
*/
// Get Group Member Free Time of Day
router.post("/free/:groupCode", async (req, res) => {
    const code = req.params?.groupCode;
    const {year, month, day} = req.body;
    if(!year || !month || !day) res.send(StatusCode.invalid);
    else {
        const result = await Free.getGroupFree(code, year, month, day);
        if(result && result.length > 0) {
            res.send(result);
        } else if(result?. length < 1) {
            res.status(StatusCode.nodata).send("[]") // 404
        } else res.sendStatus(500)
    }
});

// 그룹 투표 목록
router.get("/vote/:groupCode", async (req, res) => {
    const code = req.params?.groupCode;
    const result = await Vote.getVoteList(code);
    res.send(result);
});
// 그룹 투표추가
router.post("/vote/:groupCode", async (req, res) => {
    const code = req.params?.groupCode;
    const {reg_id, memo,start, end, name, minLength} = req.body;
    const result = await Vote.addVote(code, reg_id, name, start, end, minLength, memo);
    if(result) res.send(result);
    else res.status(500).send("error");
});


// 그룹 스케줄 목록
router.get("/schedule/:groupCode", async (req, res) => {
    const code = req.params?.groupCode;
    const result = await Schedule.getGroupSchedule(code);
    if(result) res.send(result);
    else res.sendStatus(404);
});

/*
    그룹의 스케줄 목록을 월별로 가져옴
*/
router.get("/schedule/:groupCode/:year/:month", async (req, res) => {
    const {groupCode, year, month} = req.params;
    if(year < 2021 || year > 2030 || month < 1 || month > 12) res.sendStatus(StatusCode.invalid); // 412
    else {
        const result = await Schedule.getGroupScheduleForMonth(groupCode, year, month);
        console.log(result);
        res.send(result);
    }
});
module.exports = router;
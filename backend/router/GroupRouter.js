const express = require('express');
const router = express.Router();
const StatusCode = require("../lib/Status-code/StatusCode");

const Group = require('../lib/component/Group');

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
    if(!id) res.sendStatus(StatusCode.invalid); // 412
    else {
        const result = await Group.getUserGroupInfo(id);
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


module.exports = router;
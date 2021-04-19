const express = require('express');
const router = express.Router();

const Group = require('../lib/component/Group');

// Group 생성
/*
    @return 200 성공
    @return 401 요청 형식 일치하지 않음
    @return 500 서버오류
*/
router.post("/", async (req, res) => {
    const admin = req.body.admin;
    if(!admin) res.sendStatus(401);
    else {
        const result = await Group.create(admin);
        if(result == 'error') res.sendStatus(500);
        else res.sendStatus(200);   
    }
});
// Group list 받아오기
/*
    @return 200 성공
    @return 204 권한 없음
    @return 401 요청 형식 일치하지 않음
    @return 500 서버오류
*/
router.get("/list/:GroupCode", async (req, res) => {
    const admin = req.body.admin;
    const groupCode = req.params.GroupCode;
    if(!groupCode || !admin) res.sendStatus(401);
    else {
        const result = await Group.getGroupList(admin, groupCode);
        if(result?.admin) res.statusCode(200).send(result.group);
        else {
            switch(result) {
                case false : {
                    res.sendStatus(204);
                    break;
                }
                case 'error' :
                default : {
                    res.sendStatus(500);
                }
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
router.put("/:GroupCode", async (req, res) => {
    const id = req.body.id;
    const groupCode = req.params.GroupCode;
    if(!groupCode || !id) res.sendStatus(401);
    else {
        const result = await Group.outOfGroup(groupCode, id);
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

module.exports = router;
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
        console.log(JSON.stringify(result));
        if(result) res.send(JSON.stringify(result));
        else {
            switch(result) {
                case 0 : {
                    res.sendStatus(StatusCode.nodata);
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
    const groupCode = req.params?.GroupCode;
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
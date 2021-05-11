const express = require('express');
const router = express.Router();

const Apply = require('../lib/component/Apply');

/*
    그룹 참여 신청자 목록 받기
    @return 200 성공
    @return 204 권한 없음
    @return 401 요청 형식 일치하지 않음
    @return 404 그룹 데이터 정보 없음
    @return 500 서버 오류
*/
router.get("/list/:GroupCode", async (req, res) => {
    const groupCode = req.params?.GroupCode;
    const admin = req.body?.admin;
    if(!groupCode || !admin) res.sendStatus(401)
    else {
        const result = await Apply.get(groupCode, admin);
        if(result.constructor == Array) res.statusCode(200).send(result);
        else {
            switch(result) {
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
        
    }
}); 
/*
    참여
    @return 200 성공
    @return 401 요청 형식 일치하지 않음
    @return 404 그룹 데이터 정보 없음
    @return 500 서버 오류
*/
router.post("/:GroupCode", async(req, res) => {
    const groupCode = req.params?.GroupCode;
    const applier = req.body?.applier;
    if(!groupCode || !applier) res.sendStatus(401)
    else {
        const result = await Apply.add(groupCode, applier);
        switch(result) {
            case true : {
                res.sendStatus(200)
                break;
            }
            case null : {
                res.sendStatus(404)
                break;
            }
            case 'error' :
            default : {
                res.sendStatus(500)
            }
        }
    }
});

/*
    신청자 승인(true) or 거절(false)

    @return 200 성공
    @return 204 권한 없음
    @return 401 요청 형식 일치하지 않음
    @return 404 그룹 데이터 정보 없음
    @return 500 서버 오류
*/
router.patch("/:GroupCode", async(req, res) => {

});



module.exports = router;
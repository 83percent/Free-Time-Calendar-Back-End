const express = require('express');
const StatusCode = require('../lib/Status-code/StatusCode');
const router = express.Router();

const Free = require("../lib/component/Free");

router.post("/:id", async(req, res) => {
    const data = req?.body;
    const id = req?.params?.id;
    const result = await Free.set(id, data);
    console.log(result);
    if(result) res.send(result); // 200
    else {
        switch(result) {
            case null : {
                res.sendStatus(StatusCode.unauthorized); // 401
            }
            case false : 
            default : {
                res.sendStatus(StatusCode.error); // 500
            }
        }
    }
})

module.exports = router;
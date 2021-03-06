const express = require('express');
const StatusCode = require('../lib/Status-code/StatusCode');
const router = express.Router();

const User = require('../lib/component/User');
/*
    Signup User Format
    {
        email : string,
        password : string,
        username : string
    }
*/
router.post('/sign', async (req, res) => {
    const { email, password, name } = req?.body;
    if(!email || !password || !name) res.sendStatus(StatusCode.invalid); // 412
    else {
        const result = await User.set(email, password, name);
        switch(result) {
            case 1 : {
                res.status(StatusCode.success).send(true); // 200
                break;
            }
            case 0 : {
                res.status(StatusCode.exist).send(false); // 208
                break;
            }
            case -1 :
            default : {
                res.status(StatusCode.error).send(false); // 500
                break;
            }
        }   
    }
});

/*
    Login body format ->
    {
        email : string,
        password : string
    }
*/
router.post('/', async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) res.sendStatus(StatusCode.invalid); // 412
    else {
        const result = await User.login(email, password);
        if(result != null) res.status(StatusCode.success).send(result); // 200
        else res.sendStatus(StatusCode.unauthorized); // 401
    }

}); // Login


/*
    @Query id : User 고유 번호
*/
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    if(!id) res.sendStatus(401);
    // TODO 

}); //  Get User Infomation

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if(!id) res.sendStatus(401);
}); // Delete User

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    if(!id) res.sendStatus(401);
}); // Modify User

router.get("/time/:id/:year/:month", async (req, res) => {
    const {id, year, month} = req.params;
    const result = await User.getTimes(id, year, month);
    res.send(result);
});
router.get("/time/:id/:year/:month/:day", async (req, res) => {
    const {id, year, month, day} = req.params;
    const result = await User.getDateTime(id, year, month, day);
    if(result.length > 0) {
        res.send(result);
    } else res.sendStatus(404);
    
});
router.post("/schedule/:id", async (req, res) => {
    const id = req.params.id;
    const result = await User.setSchedule(id, req.body);
});

module.exports = router;
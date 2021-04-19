const express = require('express');
const router = express.Router();
/*
    Signup User Format
    {
        email : string,
        password : string,
        username : string
    }
*/
router.post('/sign', async (req, res) => {
    const data = req.body;
    if(!data.email || !data.password || !data.name) res.sendStatus(401);
    
});

/*
    Login body format ->
    {
        email : string,
        password : string
    }
*/
router.post('/', async (req, res) => {
    const data = req.body;
    if(!data.email || !data.password) res.sendStatus(401);
    // TODO

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

router.put(':/id', async (req, res) => {
    const id = req.params.id;
    if(!id) res.sendStatus(401);
}); // Modify User

module.exports = router;
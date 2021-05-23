const express = require('express');
const StatusCode = require('../lib/Status-code/StatusCode');
const router = express.Router();

const Schedule = require('../lib/component/Schedule');

router.get("/:id/:date", async (req, res) => {
    const id = req.params?.id;
    const date = req.params?.date;

    const result = await Schedule.get(id, date);
});

//  @SET '/user/schedule/:id'
router.post("/:id", async (req, res) => {
    const data = req?.body;
    const id = req.params?.id;
    if(!id) res.status(StatusCode.invalid).send("invalid") // 412
    else {
        const result = await Schedule.set(id, data);
    }
});

router.delete("/:scheduleID", async (req, res) => {
    const {year, month, id} = req.body;
    const scheduleID = req.params.scheduleID;
    if(!scheduleID) res.status(StatusCode.invalid).send("-1");
    else {

    }
});
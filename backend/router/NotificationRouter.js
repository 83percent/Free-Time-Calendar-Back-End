const express = require('express');
const router = express.Router();

const Notification = require("../lib/component/Notification");
const UserModel = require("../lib/Model/UserModel");

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    
    const user = await UserModel.findById(id, ["alarm"]);

    console.log(user);

    res.send(user.alarm);
    user.alarm = [];
    await user.save();
})

module.exports = router;
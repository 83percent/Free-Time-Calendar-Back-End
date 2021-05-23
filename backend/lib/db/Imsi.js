const express = require('express');
const router = express.Router();

const ClientModel = require("../Model/ClientModel");

/*
    발열을 체크한 뒤 데이터를 보관하는 알고리즘 
    - Node.js (Express.js + MongoDB +  Mongo Atlas + Mongoose)
    - REST api

    Server GCP : http://34.84.172.217:3001
*/

/*
    Client Model Data Format
    {
        _id : ObjectId(),
        name : String,      // 이름
        address : String,   // 주소
        tel : String,       // 연락처
        temp : Number,      // 측정 온도
        reg_date : Date     // 측정 시간
    }
*/

/*
    GET
    - 발열 측정 데이터 검색     (이름으로 검색)
    @param name:String         이름

    @status 200     Success
    @status 404     No Data
    @status 412     Invalid Data
    @status 500     Error
*/
router.get("/:name", async (req, res) => {
    const name = req.params.name;
    if(!name) res.status(412).send("Invalid request data.");
    else {
        const clients = await ClientModel.find(name);
        if(clients?.length > 0) res.send(clients);
        else if(!clients) res.status(404).send("No data");
        else res.status(500).send("Error");
    }
});


/*
    GET
    - 발열 측정 데이터 검색     (측정 체온으로 검색)
    @param MinTemp :Number    검색 최저온도

    @status 200     Success
    @status 404     No Data
    @status 412     Invalid Data
    @status 500     Error
*/
router.get("/:MinTemp/:MaxTemp", async (req, res) => {
    const minT = req.params.MinTemp;    
    if(!minT) res.status(412).send("Invalid request data.");
    else {
        const clients = await ClientModel.find({"temp" : {$gt : minT}});
        if(clients?.length > 0) res.send(clients);
        else if(!clients) res.status(404).send("No data");
        else res.status(500).send("Error");
    }
});

/*
    POST
    - 온도 측정자 데이터 저장

    @body   name :String        이름
            tel :String         전화번호
            address :String     주소
            temp :Number        체온

    @status 200     Success
    @status 412     Invalid Data
    @status 500     Error
*/
router.post("/", async (req, res) => {
    if(req.body.length != 4) res.status(412).send("Invalid request data.");
    else {
        const {name, tel, address, temp} = req.body;
        const client = new ClientModel({
            name, tel, address, temp
        });
        const _c = await client.save();
        if(!_c?._id) res.status(500).send("Error");
        else res.status(200).send("Save");
    }
});

/*
    DELETE
    - 데이터 삭제       (YYYY년 MM월 이하로 모든 데이터 삭제);

    @param YYYY :Number
    @param MM :Number
    
    @status 200     Success (Msg - Delete Count :Number)
    @status 404     No Data
    @status 412     Invalid Data
    @status 500     Error
*/
router.delete("/:YYYY/:MM", async (req, res) => {
    const year = req.params.YYYY;
    const month = req.params.MM;
    if(!year || !month) res.status(412).send("Invalid request data.");
    else {
        const client = await ClientModel.deleteMany(
            {"reg_date": {$lt : new Date(`${year}-${month}-01`)}}
        );
        if(client?.deletedCount > 0) res.send(`${client.deletedCount}`);
        else if(client?.deletedCount == 0) res.statuc(404).send("No data");
        else res.status(500).send("Error");
    }
});
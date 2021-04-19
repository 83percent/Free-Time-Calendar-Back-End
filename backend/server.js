const express = require('express');
const __Mongoose = require('./lib/db/Mongo');


// Router
const UserRouter = require('./router/UserRouter');

// FIELD
const PORT = 3001;
const server = express();


server.use('/user', UserRouter);

server.listen(PORT, () => {
    console.log(" Start Server.js PORT : ",PORT);
});
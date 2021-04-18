const express = require('express');
const __Mongoose = require('./lib/db/Mongo');


// Router
const user = require('./router/User');

// FIELD
const PORT = 3001;
const server = express();

server.use('/user', user);

server.listen(PORT, () => {
    console.log(" Start Server.js PORT : ",PORT);
});
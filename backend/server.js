const express = require('express');

// Router
const user = require('./router/User');


// FIELD
const PORT = 3002;
const server = express();

server.use('/user', user);

server.listen(PORT, () => {
    console.log(" Start Server.js PORT : ",PORT);
});
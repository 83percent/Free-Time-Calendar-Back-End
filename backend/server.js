const express = require('express');
const __Mongoose = require('./lib/db/Mongo');
const bodyParser = require('body-parser');

// Router
const UserRouter = require('./router/UserRouter');
const GroupRouter = require('./router/GroupRouter');
const ApplyRouter = require('./router/ApplyRouter');
const FreeRouter = require('./router/FreeRouter');
const VoteRouter = require('./router/VoteRouter');
const NotificationRouter = require('./router/NotificationRouter');

// FIELD
const PORT = 3001;
const server = express();

server.use(bodyParser.json())

server.use('/user', UserRouter);
server.use('/group', GroupRouter);
server.use('/apply', ApplyRouter);
server.use('/free', FreeRouter);
server.use('/vote', VoteRouter);
server.use('/notification', NotificationRouter);

server.listen(PORT, () => {
    console.log(" Start Server.js PORT : ",PORT);
});
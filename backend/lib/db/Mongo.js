
const mongoose = require('mongoose');

// local
const __url = 'mongodb://127.0.0.1:27017/capstone?poolSize=20&writeConcern=majority';
// Atlas


mongoose.connect(
    __url, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
); // Connect Mongoose

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Mongoose - MongoDB Connection Access Success.");
});

module.exports = mongoose;
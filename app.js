var bodyparser = require('body-parser');
var cors = require('cors')
var express = require('express');
var mongoose = require('mongoose')
const config = require('./config/database');

var app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(bodyparser.json());

mongoose.connect(config.database, {
    useNewUrlParser: true
});

mongoose.connection.on('connected', () => {
    console.log('DB is live > ' + config.database);

});

const player = require('./routes/player');
const season = require('./routes/season');
const stats = require('./routes/seasonStats');

app.use('/player', player);
app.use('/season', season);
app.use('/stats', stats);

app.listen(PORT, () => {
    console.log('server started at port' + PORT);
});
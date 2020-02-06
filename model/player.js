const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    pubgID: {
        type: String,
        default: ''
    }
})



const Player = module.exports = mongoose.model('Player', playerSchema);
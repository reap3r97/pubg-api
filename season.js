const mongoose = require('mongoose');

const seasonSchema = mongoose.Schema({
    seasonId: {
        type: String,
        required: true
    }

})
const Season = module.exports = mongoose.model('Season', seasonSchema);
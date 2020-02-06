var express = require('express');
var router = express.Router();
const https = require('https');
var fs = require('fs');
const Season = require('../model/season')
const Player = require('../model/player')
var apikey = fs.readFileSync('./key/key.txt', 'utf8')

var optionsget = {

    host: 'api.pubg.com', // here only the domain name
    // (no http/https !)
    //port : 443,
    path: '', // the rest of the url with parameters if needed
    headers: {
        "Authorization": apikey,
        "Accept": "application/vnd.api+json"
    },
    method: 'GET'

};

router.post('/getSeasonStats', (req, res, next) => {
    let statsFound = [];
    let errors = []
    let plat = req.body.platform
    let accountId = req.body.accountId
    let seasonId = req.body.seasonId
    if (!plat) {
        errors.push({
            text: 'No platform entered'
        })
    }
    if (!accountId) {
        errors.push({
            text: 'No account id entered'
        })
    }
    if (!seasonId) {
        errors.push({
            text: 'No season id entered'
        })
    }
    if (errors.length > 0) {
        res.json({
            errors: errors
        });
    } else {
        console.log(req.body.platform)
        const url = `/shards/${plat}/players/${accountId}/seasons/${seasonId}`
        console.log(url)
        optionsget.path = url
        console.log(optionsget)
        https.request(optionsget, (resp) => {
            resp.on('data', (chunk) => {
                statsFound += chunk;
            });
            resp.on('end', () => {
                var stats = JSON.parse(statsFound)
                console.log(stats)
                console.log("Extracting stats: " + stats)
                res.json(stats)
            });
        }).end(
        ).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
});



module.exports = router;
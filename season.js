var express = require('express');
var router = express.Router();
const https = require('https');
var fs = require('fs');
const Season = require('../model/season')
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

router.post('/getAllSeasons', (req, res, next) => {
    let seasonsFound = [];

    let plat = req.body.platform

    console.log(req.body.platform)
    const url = `/shards/${plat}/seasons`
    console.log(url)
    optionsget.path = url
    console.log(optionsget)
    https.request(optionsget, (resp) => {
        resp.on('data', (chunk) => {
            seasonsFound += chunk;
        });
        resp.on('end', () => {
            var seasons = JSON.parse(seasonsFound)
            console.log(seasons)
            console.log("Extracting seasons: " + seasons)
            res.json(seasons)
        });
    }).end(
    ).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});

router.post('/saveSeason', (req, res, next) => {
    let errors = [];
    let seasonId = req.body.seasonId
    if (seasonId = "") {
        errors.push({
            text: 'No seasonId entered'
        });
    }
    if (errors.length > 0) {
        res.json({
            errors: errors
        });
    } else {
        const newSeason = Season({
            seasonId: seasonId
        })
        newSeason
            .save()
            .then(result => {
                res.json({
                    message: 'Season added succesfully ' + result
                })
            }).catch(err => {
                res.json({
                    error: err
                })
            })
    }
})

router.get('/seasons', (req, res, next) => {
    Season.find(function (err, foundSeasons) {
        if (err) {
            return res.json(err);
        }
        else if (!foundSeasons) {
            return res.json({
                success: false,
                message: "No seasons found"
            })
        }
        else {
            return res.json(foundSeasons);
        }
    });
})


router.post('/seasonById', (req, res, next) => {

    let errors = [];
    if (req.body.id = "") {
        errors.push({
            text: 'No user id entered'
        });
    }
    if (errors.length > 0) {
        res.json({
            errors: errors
        });
    } else {
        Season.findOne({ seasonID: id }, (err, foundSeason) => {
            if (err) {
                res.json({
                    errors: err
                })
            }
            else {
                res.json(foundSeason)
            }
        })
    }
})



module.exports = router;

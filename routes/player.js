var express = require('express');
var router = express.Router();
const https = require('https');
var fs = require('fs');
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


router.post('/getPlayerByName', (req, res, next) => {
    let pl = [];
    let plat = req.body.platform
    console.log(req.body.username)
    console.log(req.body.platform)
    let username = req.body.username
    const url = `/shards/${plat}/players?filter[playerNames]=${username}`
    console.log(url)
    optionsget.path = url
    console.log(optionsget)
    https.request(optionsget, (resp) => {
        resp.on('data', (chunk) => {
            pl += chunk;
        });

        resp.on('end', () => {
            var player = JSON.parse(pl)
            console.log(player)
            console.log("Extracting player id: " + player.data[0].id)
            res.json(player.data[0].id)

        });


    }).end(

    ).on("error", (err) => {

        console.log("Error: " + err.message);
    });
});

router.post('/savePlayer', (req, res, next) => {
    let errors = [];
    let username = req.body.username
    if (username = "") {
        errors.push({
            text: 'No username entered'
        });
    }
    if (errors.length > 0) {
        res.json({
            errors: errors
        });
    } else {
        const newPlayer = Player({
            username: username
        })
        newPlayer
            .save()
            .then(result => {
                res.json({
                    message: 'Player added succesfully ' + result
                })
            }).catch(err => {
                res.json({
                    error: err
                })
            })
    }
})

router.post('/getPlayerById', (req, res, next) => {
    let pl = [];
    let plat = req.body.platform
    console.log(req.body.id)
    console.log(req.body.platform)
    let id = req.body.id
    const url = `/shards/${plat}/players?filter[playerIds]=${id}`
    console.log(url)
    optionsget.path = url
    console.log(optionsget)
    https.request(optionsget, (resp) => {
        resp.on('data', (chunk) => {
            pl += chunk;
        });

        resp.on('end', () => {
            var player = JSON.parse(pl)
            console.log(player)
            console.log("Extracting player name: " + player.data[0].attributes.name)
            res.json(player.data[0].attributes.name)

        });


    }).end(

    ).on("error", (err) => {

        console.log("Error: " + err.message);
    });
});

router.post('/savePlayerId', (req, res, next) => {
    let errors = [];
    if (id = "") {
        errors.push({
            text: 'No user id entered'
        });
    }
    if (errors.length > 0) {
        res.json({
            errors: errors
        });
    } else {
        Player.findByIdAndUpdate(req.body._id, {
            $set: {
                pubgID: id
            }
        }, {
            new: true
        }, function (err, updatedPlayer) {
            if (err) {
                res.json({
                    message: err
                })
            }
            else if (updatedPlayer) {
                res.json({
                    message: 'Player updated successfully'
                })
            }
        })
    }
})

router.post('/PlayerByName', (req, res, next) => {

    let errors = [];
    if (username = "") {
        errors.push({
            text: 'No username entered'
        });
    }
    if (errors.length > 0) {
        res.json({
            errors: errors
        });
    } else {
        Player.findOne({ username: username }, (err, foundPlayer) => {
            if (err) {
                res.json({
                    errors: err
                })
            }
            else {
                res.json(foundPlayer)
            }
        })
    }
})

router.post('/PlayerById', (req, res, next) => {

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
        Player.findOne({ pubgID: id }, (err, foundPlayer) => {
            if (err) {
                res.json({
                    errors: err
                })
            }
            else {
                res.json(foundPlayer)
            }
        })
    }
})


module.exports = router;
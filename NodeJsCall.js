var express = require('express');
var router = express.Router();
const https = require('https');
var fs = require('fs');

var apikey = fs.readFileSync('./key/key.txt', 'utf8')



router.post('/getData', (req, res, next) => {
    let pl = [];
    let plat = req.body.platform
    console.log(req.body.playerName)
    console.log(req.body.platform)
    let playerName = req.body.playerName
    const url = `/shards/${plat}/players?filter[playerNames]=${playerName}`
    console.log(url)
    var optionsget = {

        host: 'api.pubg.com', // here only the domain name
        // (no http/https !)
        //port : 443,
        path: url, // the rest of the url with parameters if needed
        headers: {
            "Authorization": apikey,
            "Accept": "application/vnd.api+json"
        },
        method: 'GET'

    };
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




module.exports = router;
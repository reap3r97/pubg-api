var express = require('express');
var router = express.Router();
const https = require('https');
var fs = require('fs');

var apikey = fs.readFileSync('./key/key.txt', 'utf8')

var optionsget = {

    host: 'api.pubg.com', // here only the domain name
    // (no http/https !)
    //port : 443,
    path: '/tournaments', // the rest of the url with parameters if needed
    headers: {
        "Authorization": apikey,
        "Accept": "application/vnd.api+json"
    },
    method: 'GET'

};
console.log(optionsget)

var getheaders = {
    "Authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkMDBiNTM4MC0yMjc4LTAxMzgtZTMwNi03ZDVjOWM4YTdjZWUiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTgwMDUwMDk3LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6ImhhbXhhLW5pYXhpLWdtIn0.mBPXRtHwx82DxLivsuID5_JD3gHnO27wfEnU1iougXA",
    "Accept": "application/vnd.api+json"

};


router.get('/getData', (req, res, next) => {
    console.log(optionsget)
    console.log(getheaders)

    https.request(optionsget, (resp) => {
        let data = '';


        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            console.log(data)
            res.json(data);

        });


    }).end().on("error", (err) => {

        console.log("Error: " + err.message);
    });
});




module.exports = router;
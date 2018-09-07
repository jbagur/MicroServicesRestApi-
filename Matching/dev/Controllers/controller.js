var express = require('express');
var con = require('../Models/model.js');


exports.findsQuery = function (req, res) {
    let category = req.query.category;
    let publisher_campaign = req.query.publisher_campaign;
    let zip_code = req.query.zip_code;
    let maximum = req.query.maximum;

    console.log(req.query.category);
    console.log(req.query.publisher_campaign);
    console.log(req.query.zip_code);


    if (!category) {
        console.log("No Category");
        res.status(400).json({
            status: 400,
            message: "No Category"
        })
        return;
    }
    /*
    if (!publisher_campaign) {
        console.log("No Campaign");
        res.status(400).json({
            status: 400,
            message: "No campaign"
        })
        return;
    }

    if (!zip_code) {
        console.log("No Zip code");
        res.status(400).json({
            status: 400,
            message: "No zip code"
        })
        return;
    }
    */
    https.get('localhost:3002?category=' + category, (resp) => {
        let data = '';
        // A chunk of data has been recieved
        resp.on('data', (chunk) => {
            data += chunk;
        });
        // The whole response has been received
        resp.on('end', () => {
            console.log("Response: " + data);
            res.send('JSON: ' + data);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    }); 

    /*https.get('localhost:3001?advertiser_campaigns=429&publisher_campaign=73=' + category, (resp) => {
        let data = '';
        // A chunk of data has been recieved
        resp.on('data', (chunk) => {
            data += chunk;
        });
        // The whole response has been received
        resp.on('end', () => {

        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    }); */
}
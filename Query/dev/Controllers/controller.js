var express = require('express');
var con = require('../Models/model.js');
var http = require('http');

exports.findQuery = function (req, res) {
    let category = 1;//req.query.category;
    //console.log(req.query.category);
    let publisher_campaign = 99;//req.query.publisher_campaign;
    //console.log(req.query.publisher_campaign);
    let zip_code = 90210;// req.query.zip_code;
    //console.log(req.query.zip_code);
    let maximum = 20;//req.query.maximum;
    //console.log(req.query.maximum);

    //console.log("Category: "+category+" Publisher_campaign: " +publisher_campaign+" Zip code: " +zip_code+"Maximum: "+maximum);


    if (category==null) {
        console.log("No Category");
        res.status(400).json({
            status: 400,
            message: "No Category"
        })
        return;
    }
    
    if (publisher_campaign==null) {
        console.log("No Campaign");
        res.status(400).json({
            status: 400,
            message: "No campaign"
        })
        return;
    }

    if (zip_code==null) {
        console.log("No Zip code");
        res.status(400).json({
            status: 400,
            message: "No zip code"
        })
        return;
    }

    if (maximum == null) {
        console.log("No maximum");
    }
    
    http.get('http://18.212.105.67:3001/?category=' + category, (resp) => {
        let data = '';
        // A chunk of data has been received
        resp.on('data', (chunk) => {
            data += chunk;
        });

        /*
        let list = '';
        for (i = 0; i < data["results"].lenght; i++) {
            var a_c = (data["results"][i]["id"]).toString();
            list.concat(a_c);
            if (i != data.results.lenght - 1) {
                list += ",";
            }
        }*/
        // The whole response has been received
        resp.on('end', () => {
            console.log("Response: " + data["results"]);
            res.send('JSON: ' + data);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    }); 

    /*
    http.get('http://18.212.105.67:3002/?advertiser_campaigns=429&publisher_campaign=73=' + category, (resp) => {
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
    });*/
}
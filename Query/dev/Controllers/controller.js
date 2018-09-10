var express = require('express');
var con = require('../Models/model.js');
var http = require('http');
var Promise = require('promise');

exports.findQuery = function (req, res) {
    let category = 1;//req.query.category;
    //console.log(req.query.category);
    let publisher_campaign = 72;//req.query.publisher_campaign;
    //console.log(req.query.publisher_campaign);
    let zip_code = 1;// req.query.zip_code;
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

    function Match(category) {
        var list = '';
        http.get('http://18.212.105.67:3001/?category=' + category, (resp) => {
            let data = '';
            // A chunk of data has been received
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received
            resp.on('end', () => {
                console.log("Response: " + data);
                var myjson = JSON.parse(data);
                //console.log("JSON: " + (myjson.results)[0].id);     
                var l = parseInt(Object.keys(myjson.results).length);
                //console.log("JSON lenght: " + l);
                for (i = 0; i < l; i++) {
                    //console.log("index: " + i);
                    var a_c = (myjson.results)[i].id;
                    list += a_c;
                    //console.log("Agregar: " + a_c);
                    if (i != l - 1) {
                        list += ",";
                    }
                }
                console.log("Matching");
                //console.log("Lista: " + list);
                //res.send('JSON: ' + data);
            });
        }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        Exclusion(list, publisher_campaign);
    }

    function Exclusion(list,publisher_campaign) {
        http.get('http://18.212.105.67:3002/?advertiser_campaigns=' + list + '&publisher_campaign=' + publisher_campaign, (resp) => {
            let data = '';
            // A chunk of data has been recieved
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received
            resp.on('end', () => {
                console.log("Exclusions");
                console.log("Response: " + data);
                res.send('JSON: ' + data);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }

    Match(category);
    /*
    http.get('http://18.212.105.67:3003/?advertiser_campaigns=' + list + '&zip_code=' + zip_code, (resp) => {
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
    });*/
    

}
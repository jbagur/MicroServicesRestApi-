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
        var advertiser_campaigns = '';
        var advertiser_campaigns_bids = '';
        http.get('http://18.212.105.67:3001/?category=' + category, (resp) => {
            let data = '';
            // A chunk of data has been received
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received
            resp.on('end', () => {                
                var myjson = JSON.parse(data);
                //console.log("JSON: " + (myjson.results)[0].id);     
                var l = parseInt(Object.keys(myjson.results).length);
                //console.log("JSON lenght: " + l);
                for (i = 0; i < l; i++) {
                    //console.log("index: " + i);
                    var a_c = (myjson.results)[i].id;
                    var a_c_b = (myjson.results)[i].bid;
                    advertiser_campaigns += a_c;
                    advertiser_campaigns_bids += a_c_b;
                    //console.log("Agregar: " + a_c);
                    if (i != l - 1) {
                        advertiser_campaigns += ",";
                        advertiser_campaigns_bids += ",";
                    }
                }
                console.log("Matching: http://18.212.105.67:3001/?category=" + category);
                console.log("Response: " + data);
                //console.log("Lista: " + list);
                //res.send('JSON: ' + data);
                Exclusion(advertiser_campaigns, publisher_campaign, advertiser_campaigns_bids);
            });
            
        }).on("error", (err) => {
                console.log("Error: " + err.message);
            });        
    }

    function Exclusion(advertiser_campaigns, publisher_campaign, advertiser_campaigns_bids) {
        http.get('http://18.212.105.67:3002/?advertiser_campaigns=' + advertiser_campaigns + '&publisher_campaign=' + publisher_campaign, (resp) => {
            let data = '';
            // A chunk of data has been received
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received
            resp.on('end', () => {
                console.log("Exclusions: http://18.212.105.67:3002/?advertiser_campaigns=" + advertiser_campaigns + '&publisher_campaign=' + publisher_campaign);
                console.log("Response: " + data);
                //res.send('JSON: ' + data);
                Targeting(advertiser_campaigns, zip_code, advertiser_campaigns_bids);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
         
    function Targeting(advertiser_campaigns, zip_code, advertiser_campaigns_bids) {
        targeted_advertiser_campaigns = '';
        http.get('http://18.212.105.67:3003/?advertiser_campaigns=' + advertiser_campaigns + '&zip_code=' + zip_code, (resp) => {
            let data = '';
            // A chunk of data has been received
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received
            resp.on('end', () => {
                var myjson = JSON.parse(data);
                //console.log("JSON: " + (myjson.results)[0].id);     
                var l = parseInt(Object.keys(myjson.results).length);
                //console.log("JSON lenght: " + l);
                for (i = 0; i < l; i++) {
                    //console.log("index: " + i);
                    var t_a_c = (myjson.results)[i].id;
                    targeted_advertiser_campaigns += a_c;
                    //console.log("Agregar: " + a_c);
                    if (i != l - 1) {
                        targeted_advertiser_campaigns += ",";
                    }
                }
                console.log('Targeting: http://18.212.105.67:3003/?advertiser_campaigns=' + advertiser_campaigns + '&zip_code=' + zip_code)
                console.log("Response: " + data);
                //res.send('JSON: ' + data);
                Ranking(targeted_advertiser_campaigns, advertiser_campaigns_bids);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }

    function Ranking(targeted_advertiser_campaigns, advertiser_campaigns_bids) {
        http.get('http://18.212.105.67:3004/?advertiser_campaigns=' + targeted_advertiser_campaigns + '&advertiser_campaigns_bids=' + advertiser_campaigns_bids, (resp) => {
            let data = '';
            // A chunk of data has been received
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received
            resp.on('end', () => {
                console.log('Ranking: http://18.212.105.67:3004/?advertiser_campaigns=' + advertiser_campaigns + '&advertiser_campaigns_bids=' + advertiser_campaigns_bids);
                console.log("Response: " + data);
                //res.send('JSON: ' + data);
                Ads(targeted_advertiser_campaigns);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }

    function Ads(targeted_advertiser_campaigns) {
        http.get('http://18.212.105.67:3005/?advertiser_campaigns=' + targeted_advertiser_campaigns, (resp) => {
            let data = '';
            // A chunk of data has been received
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received
            resp.on('end', () => {
                console.log('Ranking: http://18.212.105.67:3005/?advertiser_campaigns=' + advertiser_campaigns);
                console.log("Response: " + data);
                res.send('JSON: ' + data);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }

    Match(category);

}
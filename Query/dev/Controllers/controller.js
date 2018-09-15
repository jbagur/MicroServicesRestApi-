var express = require('express');
var con = require('../Models/model.js');
var http = require('http');


exports.findQuery = function (req, res) {
    let category = 1//req.query.category;
    //console.log(req.query.category);
    let publisher_campaign = 85//req.query.publisher_campaign;
    //console.log(req.query.publisher_campaign);
    let zip_code = 90210//req.query.zip_code;
    //console.log(req.query.zip_code);
    let maximum = req.query.maximum;
    //console.log(req.query.maximum);
    var query_id = "";
    console.log("Category: "+category+" Publisher_campaign: " +publisher_campaign+" Zip code: " +zip_code+" Maximum: "+maximum);
    
    
    if (category==null) {
        console.log("No Category");
        res.status(400).json({
            status: 400,
            message: "No Category"
        })
        return;
    }
    
    if (publisher_campaign==null) {
        console.log("No Publisher");
        res.status(400).json({
            status: 400,
            message: "No publisher"
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

    let maximum_text = '&maximum=';
    if (maximum == null) {
        console.log("No maximum");
    } else {        
        maximum_text += maximum;
    }

    con.query('INSERT INTO queries SET ?', { category: category, publisher_campaign: publisher_campaign, zip_code: zip_code, maximum: maximum }, function (error, results, fields) {
        if (error) {
            console.log('Query error. ' + error.message);
        }
        query_id = results.insertId;
        console.log("query_id: " + query_id);
    });

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
                console.log("Matching: http://18.212.105.67:3001/?category=" + category);
                console.log("Response: " + data);
                var myjson = JSON.parse(data);
                if (typeof myjson == "undefined") {
                    console.log("Matching error");
                    res.status(400).json({
                        status: 400,
                        message: "Matching error"
                    })
                    return;
                }
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
                
                //console.log("Lista: " + list);
                //res.send('JSON: ' + data);
                Exclusion(advertiser_campaigns, publisher_campaign, advertiser_campaigns_bids);
            });
            
        }).on("error", (err) => {
                console.log("Error: " + err.message);
            });        
    }

    function Exclusion(advertiser_campaigns, publisher_campaign, advertiser_campaigns_bids) {
        var exclusive_advertiser_campaigns;
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
                
                var myjson = JSON.parse(data);
                console.log("myjson.results: " + myjson.results);
                if (typeof myjson.results == "undefined") {
                    console.log("Exclusion error");
                    res.status(400).json({
                        status: 400,
                        message: "Exclusion error"
                    })
                    return;
                }
                //console.log("JSON: " + (myjson.results)[0].id);
                exclusive_advertiser_campaigns = myjson.results;
                console.log("exclusive_advertiser_campaigns: " + exclusive_advertiser_campaigns);
                var l = parseInt(Object.keys(myjson.results).length);
                //console.log("JSON lenght: " + l);
                var exclusion_list = [];
                for (i = 0; i < l; i++) {
                    //console.log("index: " + i);
                    var e_a_c = exclusive_advertiser_campaigns[i];
                    //console.log("Agregar: "+e_a_c);                    
                    exclusion_list.push(e_a_c);
                }
                //res.send('JSON: ' + data);
                Targeting(advertiser_campaigns, zip_code, advertiser_campaigns_bids,exclusion_list);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
         
    function Targeting(advertiser_campaigns, zip_code, advertiser_campaigns_bids,exclusion_list) {
        let targeted_advertiser_campaigns = '';
        http.get('http://18.212.105.67:3003/?advertiser_campaigns=' + advertiser_campaigns + '&zip_code=' + zip_code, (resp) => {
            let data = '';
            // A chunk of data has been received
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received
            resp.on('end', () => {
                console.log('Targeting: http://18.212.105.67:3003/?advertiser_campaigns=' + advertiser_campaigns + '&zip_code=' + zip_code)
                console.log("Response: " + data);
                //res.send('JSON: ' + data);

                var myjson = JSON.parse(data);
                if (typeof myjson.results == "undefined") {
                    console.log("Targeting error");
                    res.status(400).json({
                        status: 400,
                        message: "Targeting error"
                    })
                    return;
                }
                //console.log("JSON: " + (myjson.results)[0].id);     
                var l = parseInt(Object.keys(myjson.results).length);
                //console.log("JSON lenght: " + l);
                var targeted_list = [];
                var list_for_ranking = [];
                for (i = 0; i < l; i++) {
                    var t_a_c = (myjson.results)[i].id;
                    targeted_advertiser_campaigns += t_a_c;
                    targeted_list.push(t_a_c);
                    //console.log("Agregar: " + t_a_c);
                    if (i != l - 1) {
                        targeted_advertiser_campaigns += ",";
                    }
                    for (j = 0; j < exclusion_list.length; j++) {
                        if (t_a_c == exclusion_list[0]) {
                            console.log("Agregar: " + t_a_c);
                            list_for_ranking.push(t_a_c);
                        }
                    }
                }

                Ranking(targeted_advertiser_campaigns, advertiser_campaigns_bids, maximum);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
    
    function Ranking(targeted_advertiser_campaigns, advertiser_campaigns_bids, maximum) {
        let ranked_advertiser_campaigns = '';
        let ranked_advertiser_campaigns_bids = '';
        http.get('http://18.212.105.67:3004/?advertiser_campaigns=' + targeted_advertiser_campaigns + '&advertiser_campaigns_bids=' + advertiser_campaigns_bids + maximum_text, (resp) => {
            let data = '';
            // A chunk of data has been received
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received
            resp.on('end', () => {
                console.log('Ranking: http://18.212.105.67:3004/?advertiser_campaigns=' + targeted_advertiser_campaigns + '&advertiser_campaigns_bids=' + advertiser_campaigns_bids);
                console.log("Response: " + data);
                
                var myjson = JSON.parse(data);
                if (typeof myjson == "undefined") {
                    console.log("Ranking error");
                    res.status(400).json({
                        status: 400,
                        message: "Ranking error"
                    })
                    return;
                }
                if (typeof myjson.results == "undefined") {
                    console.log("Ranking error");
                    res.status(400).json({
                        status: 400,
                        message: "Ranking error"
                    })
                    return;
                }
                //console.log("JSON: " + (myjson.results)[0].id);     
                var l = parseInt(Object.keys(myjson.results).length);
                //console.log("JSON lenght: " + l);
                for (i = 0; i < l; i++) {
                    var r_a_c = (myjson.results)[i];
                    ranked_advertiser_campaigns += r_a_c;
                    //console.log("Agregar: " + a_c);
                    if (i != l - 1) {
                        ranked_advertiser_campaigns += ",";
                    }
                }
                
                //res.send('JSON: ' + data);
                Ads(ranked_advertiser_campaigns);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }

    function Ads(ranked_advertiser_campaigns) {
        http.get('http://18.212.105.67:3005/?advertiser_campaigns=' + ranked_advertiser_campaigns, (resp) => {
            let data = '';
            // A chunk of data has been received
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received
            resp.on('end', () => {
                console.log('Ads: http://18.212.105.67:3005/?advertiser_campaigns=' + ranked_advertiser_campaigns);
                console.log("Response: " + data);
                var myjson = JSON.parse(data);
                if (typeof myjson == "undefined") {
                    console.log("Ads error");
                    res.status(400).json({
                        status: 400,
                        message: "Ads error"
                    })
                    return;
                }
                if (typeof myjson.results == "undefined") {
                    console.log("Ads error");
                    res.status(400).json({
                        status: 400,
                        message: "Ads error"
                    })
                    return;
                }
                respuesta = '{ "header": { "query_id": ' + query_id + '},' + '"ads":' + JSON.stringify(myjson.results) + "}";
                res.send('JSON: ' + respuesta);
                });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }

    function Pricing(ranked_advertiser_campaigns,advertiser_campaign_bids,publisher_campaigns) {
        http.get('http://18.212.105.67:3006/?advertiser_campaigns=' + ranked_advertiser_campaigns, (resp) => {
            let data = '';
            // A chunk of data has been received
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received
            resp.on('end', () => {
                console.log('Pricing: http://18.212.105.67:3006/?advertiser_campaigns=' + ranked_advertiser_campaigns);
                console.log("Response: " + data);
                res.send('JSON: ' + data);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }

    Match(category);

}
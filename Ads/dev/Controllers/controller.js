var express = require('express');
var con = require('../Models/model.js');


exports.findAds = function(req, res){
  let advertiser_campaigns = req.query.advertiser_campaigns;
  console.log(req.query.category);
  
  
  if (!advertiser_campaigns) {
      console.log("No Advertiser Campaigns");
      res.status(400).json({
          status: 400,
          message: "No Advertiser Campaigns"
      })
      return;
  }
    
  con.query('SELECT id, headline, description, url FROM ads JOIN campaign_ads ON ads.id = campaign_ads.ad_id WHERE campaign_ads.campaign_id IN ('+advertiser_campaigns+') GROUP BY campaign_ads.campaign_id ORDER BY RAND()', (err, result, fields) => {
      if (err) {
          console.log("Status 500. Details: " + err);
          res.status(500).json({
              status: 500,
              message: "Internal server error",
              details: err
          });
          return;
      } 
      if (result.length > 0){
          console.log(JSON.stringify(result, null, 4));
          res.status(200).json({
              results: result
          });
      }
      else {
          console.log("No existe ningun Ad para este advertiser");
          res.status(404).json({
              status: 404,
              message: "No existe ningun Ad para este advertiser"
          });
      }

  });

}

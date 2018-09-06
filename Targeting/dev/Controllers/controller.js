var express = require('express');
var con = require('../Models/model.js');


exports.findTargeting = function(req, res){
  let advertiser_campaigns = req.query.advertiser_campaigns;
  console.log(req.query.advertiser_campaigns);
  let zip_code = req.query.zip_code;
  console.log(req.query.zip_code); 
  
  if (!advertiser_campaigns) {
      console.log("No Advertiser Campaigns");
      res.status(400).json({
          status: 400,
          message: "No Advertiser Campaigns"
      })
      return;
  }
    
  if (!zip_code) {
      console.log("No Zip Code");
      res.status(400).json({
          status: 400,
          message: "No Zip Code"
      })
      return;
  } 
  con.query('SELECT id FROM advertiser_campaigns WHERE advertiser_campaigns.id IN ('+advertiser_campaigns+') AND (targeting IS NULL OR targeting LIKE "%'+zip_code+'%")',(err, result, fields) => {
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
          console.log("No existe ninguna campaña para este advertiser");
          res.status(404).json({
              status: 404,
              message: "No existe ninguna campaña para este advertiser"
          });
      }

  });

}

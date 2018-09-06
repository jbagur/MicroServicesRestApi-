var express = require('express');
var con = require('../Models/model.js');


exports.findExclusions = function(req, res){
/*   let advertiser_campaign = req.query.advertiser_campaign;
  console.log(req.query.advertiser_campaign); */
    
  let publishers_campaigns = req.query.publishers_campaigns;
  console.log(req.query.publishers_campaigns);
  
/*   if (!advertiser_campaign) {
      console.log("No Advertiser Campaign");
      res.status(400).json({
          status: 400,
          message: "No Advertiser Campaign"
      })
      return;
  } */
    
  if (!publishers_campaigns ) {
      console.log("No Publisher Campaign");
      res.status(400).json({
          status: 400,
          message: "No Publisher Campaign"
      })
      return;
  }
  con.query('SELECT advertiser_campaigns.id FROM publishers_campaigns JOIN publishers ON publishers_campaigns.publisher_id = publishers.id JOIN publisher_exclusions ON publisher_exclusions.publisher_id = publishers.id JOIN advertisers ON publisher_exclusions.advertiser_id = advertisers.id JOIN advertiser_campaigns ON advertisers.id = advertiser_campaigns.advertiser_id WHERE publishers_campaigns.id = ?', publishers_campaigns, (err, result, fields) => {
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
          console.log("No existe ninguna campaña con el publisher id deseado.");
          res.status(404).json({
              status: 404,
              message: "No existe ninguna campaña con el publisher id deseado."
          });
      }

  });

}

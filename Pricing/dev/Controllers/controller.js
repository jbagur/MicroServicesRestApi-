var express = require('express');
var con = require('../Models/model.js');


exports.findPricing= function(req, res){

  let advertiser_campaigns = req.query.advertiser_campaigns;
  console.log(req.query.advertiser_campaign); 
    
  let advertiser_campaigns_bids = req.query.advertiser_campaigns_bids;
  console.log(req.query.advertiser_campaigns_bids);

  let publisher_campaign = req.query.publisher_campaign;
  console.log(req.query.publisher_campaign);
  
   if (!advertiser_campaigns) {
      console.log("No Advertiser Campaign");
      res.status(400).json({
          status: 400,
          message: "No Advertiser Campaign"
      })
      return;
  } 
   
  if (!advertiser_campaigns_bids) {
    console.log("No Advertiser Campaign Bid");
    res.status(400).json({
        status: 400,
        message: "No Advertiser Campaign Bid"
    })
    return;
}

  if (!publisher_campaign ) {
      console.log("No Publisher Campaign");
      res.status(400).json({
          status: 400,
          message: "No Publisher Campaign"
      })
      return;
  }
  con.query('SELECT commission FROM publishers_campaigns WHERE id = ?', publisher_campaign, (err, result, fields) => {
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

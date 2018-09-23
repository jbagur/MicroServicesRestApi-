var express = require('express');
var con = require('../Models/model.js');
console.log("Iniciando servicio de pricing.");

exports.findPricing= function(req, res){
    
  let advertiser_campaigns = req.query.advertiser_campaigns.split(",");
  console.log("Lista de Advertiser Id's");
  console.log(advertiser_campaigns);
    
  let advertiser_campaigns_bids = req.query.advertiser_campaigns_bids.split(",");
  console.log("Lista de Bid's");
  console.log(advertiser_campaigns_bids);

  let publisher_campaign = req.query.publisher_campaign;
  console.log(req.query.publisher_campaign);

  let adCamId = [];
  let bidCom = [];
  for(i=0; i<advertiser_campaigns.length; i++){
      adCamId.push(parseInt(advertiser_campaigns[i]));
      bidCom.push(parseInt(advertiser_campaigns_bids[i]));
  }
  
  //console.log("Listas");
  //console.log(adCamId);
  //console.log(bidCamId);
  
  
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
          console.log("Hubo un error con el query.");
          console.log("Status 500. Details: " + err);
          res.status(500).json({
              status: 500,
              message: "Internal server error",
              details: err
          });
          return;
      } 
      if (result.length > 0){
          let itemJson = JSON.stringify(result);
          let itemParsed = JSON.parse(itemJson);
          //console.log("itemJson");
          //console.log(itemJson);
          //console.log("itemParsed");
          //console.log(itemParsed);
          //console.log(itemJson[0]["commission"]);
          let commVal = itemParsed[0]["commission"]
          //console.log(commVal);
          //console.log(bidCom);
          for(i=0; i<bidCom.length; i++){
            bidCom[i]*=commVal;
        }
          console.log("Bids:"+bidCom);

          var obj = {};
          for (var i = 0; i < bidCom.length; i++) {
             obj[adCamId[i]] = bidCom[i];
          }

          console.log(JSON.stringify(obj, null, 4));
          res.status(200).json({
              results: obj
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

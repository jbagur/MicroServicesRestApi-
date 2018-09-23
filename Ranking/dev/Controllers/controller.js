var express = require('express');
var con = require('../Models/model.js');
console.log("Iniciando servicio de ranking.");

exports.getRanking = function(req, res){
  let advertiser_campaigns = req.query.advertiser_campaigns.split(",");
  console.log(advertiser_campaigns);
  let advertiser_campaigns_bids = req.query.advertiser_campaigns_bids.split(",");
  console.log(advertiser_campaigns_bids)
  let maximum = req.query.maximum;
  let rankings = [];
    
  if (!advertiser_campaigns) {
      console.log("No Advertiser Campaigns");
      res.status(400).json({
          status: 400,
          message: "No Advertiser Campaigns"
      })
      return;
  }
    
  if (!advertiser_campaigns_bids) {
      console.log("No Advertiser Campaign Bids");
      res.status(400).json({
          status: 400,
          message: "No Advertiser Campaign Bids"
      })
      return;
  
  }
    
  if (!maximum) {
      maximum = 10;
      console.log("No se especifico un maximo por lo cual ha sido igualado a 10");
  
  }
    
  
  if (advertiser_campaigns.length != advertiser_campaigns_bids.length) {
      console.log("Error! The number of advertiser campaigns must be equal to the number of bids!");
      res.status(404).json({
          status:404,
          message: "Error! The number of advertiser campaigns must be equal to the number of bids!"
      })
      return;
  
  }
    
  
  for(i=0; i<advertiser_campaigns.length; i++){
      let bid = [];
      bid.push(advertiser_campaigns[i]);
      bid.push(parseFloat(advertiser_campaigns_bids[i]));
      rankings.push(bid);
  }
  console.log("List of bids and campaigns: ");
  console.log(rankings);
  console.log("maximum: ")
  console.log(maximum);
    
  function comparator(a, b) {    
    if (a[1] > b[1]) return -1
    if (a[1] < b[1]) return 1
    return 0
  }
    
  rankings = rankings.sort(comparator);
  
  console.log("Rankings in descending oder: ");
  console.log(rankings);
    
  let topRankings = [];
   
  if(rankings.length < maximum){
      maximum = rankings.length;
  }
 
  for(i=0; i<maximum; i++){
      topRankings.push(rankings[i][0]);
  }
  
  
    
  console.log(JSON.stringify(topRankings, null, 4));
          res.status(200).json({
              results: topRankings
          });
  return;
}
    
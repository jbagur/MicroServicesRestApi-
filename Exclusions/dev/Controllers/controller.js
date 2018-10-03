var express = require('express');
var con = require('../Models/model.js');
console.log("Empezando el microservicio de exclusions");

exports.findExclusions = function(req, res){

  let advertiser_campaigns = req.query.advertiser_campaigns;
  console.log(req.query.advertiser_campaign); 
    
  let publisher_campaign = req.query.publisher_campaign;
  console.log(req.query.publisher_campaigns);
  
  let exclusionList = advertiser_campaigns.split(",");
  let exclusions = []
  for(i=0; i<exclusionList.length; i++){
      console.log("Creando la lista de exclusiones, iteracion numero: " + i);
      exclusions.push(parseInt(exclusionList[i]));
  }

   if (!advertiser_campaigns) {
      console.log("No Advertiser Campaign");
      res.status(400).json({
          status: 400,
          message: "No Advertiser Campaign"
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
  con.query('SELECT advertiser_campaigns.id FROM publishers_campaigns JOIN publishers ON publishers_campaigns.publisher_id = publishers.id JOIN publisher_exclusions ON publisher_exclusions.publisher_id = publishers.id JOIN advertisers ON publisher_exclusions.advertiser_id = advertisers.id JOIN advertiser_campaigns ON advertisers.id = advertiser_campaigns.advertiser_id WHERE publishers_campaigns.id = ?', publisher_campaign, (err, result, fields) => {
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
          let itemJson = JSON.stringify(result);
          let itemParsed = JSON.parse(itemJson);
          console.log("El query devolvio por lo menos un resultado.");
          console.log(itemParsed);
          let filteredList = []
          
          for(i=0; i<exclusions.length; i++){
              checkExclusions = itemParsed["id"].includes(exclusions[i]);
              if(!checkExclusions){
                  console.log(itemParsed[i]["id"] + " no estaba en la lista de exclusiones por lo cual paso el filtro.");
                  filteredList.push(exclusions[i]);
              }
          }
        
          //for(i=0; i<itemParsed.length; i++){
            //  checkExclusions = exclusions.includes(itemParsed[i]["id"]);
              //if(checkExclusions){
                //  console.log(itemParsed[i]["id"] + " no estaba en la lista de exclusiones por lo cual paso el filtro.");
                  //filteredList.push(itemParsed[i]["id"]);
              //}
          //}
           
          console.log(JSON.stringify(filteredList, null));
          res.status(200).json({
              results: filteredList
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

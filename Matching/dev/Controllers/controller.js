var express = require('express');
var con = require('../Models/model.js');


exports.findMatch = function(req, res){
  let category = req.query.category;
  console.log(req.query.category);
  
  if (!category) {
      console.log("No Category");
      res.status(400).json({
          status: 400,
          message: "No Category"
      })
      return;
  }
  con.query('SELECT id, bid, targeting FROM advertiser_campaigns WHERE status = true AND category = ? ', category, (err, result, fields) => {
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
          console.log("No existe ninguna campaña con el ID " + category + ".");
          res.status(404).json({
              status: 404,
              message: "No existe ninguna campaña con el ID " + " #" + category + "."
          });
      }

  });

}

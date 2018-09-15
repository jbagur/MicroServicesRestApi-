var mysql = require('mysql');
 let con = mysql.createConnection({
        host     : 'cloudinstance.cpdklpgwwv5s.us-east-1.rds.amazonaws.com',
        user     : 'Administrator',
        password : 'Cloud#CS2018',
        database : 'database1'
 });
  con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
module.exports = con;

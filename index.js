var express = require("express");
var app = express();

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'sql12.freemysqlhosting.net',
  user     : 'sql12233718',
  password : 'z3nKLC9K28',
  database : 'sql12233718'
});

connection.connect();

app.get("/", function(req, res){
    connection.query('SELECT * FROM users WHERE user_email="amit@amit.com"', function (err, rows, fields) {
        if (err) throw err
      
        res.send("welcome!! "+ rows[0].user_email);
      });
      
    connection.end();
    // res.send("welcome!!");
    
});
process.on('uncaughtException', function (err) {
    console.log(err);
});
var port = process.env.PORT || 3000;
app.listen(port);
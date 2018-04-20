var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'sql12.freemysqlhosting.net',
  user     : 'sql12233718',
  password : 'z3nKLC9K28',
  database : 'sql12233718'
});

connection.connect();

router.get("/welcome", function(req, res){
    res.send("welcome!!");
    
});

router.post('/login',function(req,res,next){
    connection.query('SELECT * FROM users WHERE user_email="'+req.body.email+'"', function (err, rows, fields) {
        if (err) throw err
      
        res.send("welcome!! "+ rows[0].user_name);

    });

});

router.get('*',function(req,res){
    res.send('Sorry invalid URL');
});

connection.end();

module.exports = api;
var express = require('express');
var api = express.Router();


var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'sql12.freemysqlhosting.net',
  user     : 'sql12233718',
  password : 'z3nKLC9K28',
  database : 'sql12233718'
});

connection.connect();

api.get("/welcome", function(req, res){
    res.send("welcome API!!");
    
});

api.post("/welcome", function(req, res){
    res.send("welcome "+req.body.name);
    
});

api.post('/login',function(req,res,next){
    var sql = 'SELECT * FROM users WHERE user_email="'+req.body.email+'"';
    console.log(sql);
    connection.query(sql, function (err, rows, fields) {
        console.log(rows.length);
        // if (err) throw err
      
        // res.send("welcome!! "+ rows[0].user_name);
        
        if(rows.length==0){
            res.status(200)
            .json({
                statusCode: 200,
                statusMsg: 'OK',
                data: 'user not exist'
            });
        }else{
            if(req.body.password==rows[0].user_password){
                res.status(200)
                .json({
                    statusCode: 200,
                    statusMsg: 'OK',
                    data: 'successful'
                });
            }else{
                res.status(200)
                .json({
                    statusCode: 200,
                    statusMsg: 'OK',
                    data: 'fail'
                });
            }
        }

        

    });

});

api.get('*',function(req,res){
    res.send('Sorry invalid URL');
});

// connection.end();

module.exports = api;
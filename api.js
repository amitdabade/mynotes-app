var express = require('express');
var api = express.Router();


var mysql = require('mysql');
var connection = mysql.createConnection({
//   host     : 'sql12.freemysqlhosting.net',
//   user     : 'sql12233718',
//   password : 'z3nKLC9K28',
//   database : 'sql12233718'
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'sql12233718'
});

connection.connect();

api.get("/welcome", function(req, res){
    res.send("welcome API!!");
    
});

api.get("/welcome/:name", function(req, res){
    res.send("welcome "+req.params.name);
    
});

api.post('/login',function(req,res,next){
    var sql = 'SELECT * FROM users WHERE user_email="'+req.body.user_email+'"';
    console.log(sql);
    connection.query(sql, function (err, rows, fields) {
        if (err) throw err
        
        if(rows.length==0){
            res.status(200)
            .json({
                statusCode: 200,
                statusMsg: 'OK',
                data: 'invalidEmail'
            });
        }else{
            if(req.body.user_password==rows[0].user_password){
                req.session.user=1;
                res.cookie('uid', rows[0].user_id, {expire: 360000 + Date.now()});
                res.cookie('uname', rows[0].user_name, {expire: 360000 + Date.now()});
                res.status(200)
                .json({
                    statusCode: 200,
                    statusMsg: 'OK',
                    data: true
                });
            }else{
                res.status(200)
                .json({
                    statusCode: 200,
                    statusMsg: 'OK',
                    data: false
                });
            }
        }      
    });

});

api.get('/getnotes/:ower',function(req,res,next){
    var sql = 'SELECT * FROM notes WHERE intrash = 0 and (ower="'+req.params.ower+'" or id in (SELECT note_id from sharewith WHERE (sharewith_id="'+req.params.ower+'" and shareby_id in (SELECT shareby_id FROM sharewith where note_id in (SELECT note_id from sharewith WHERE sharewith_id="'+req.params.ower+'") and sharewith_id="'+req.params.ower+'"))))';
    console.log(sql);
    connection.query(sql, function (err, rows, fields) {
        if (err) throw err
        
        res.status(200)
        .json({
            statusCode: 200,
            statusMsg: 'OK',
            data: rows
        });
           
    });

});

api.get('/gettrashnotes/:ower',function(req,res,next){
    var sql = 'SELECT * FROM notes WHERE intrash = 1 and ower="'+req.params.ower+'"';
    console.log(sql);
    connection.query(sql, function (err, rows, fields) {
        if (err) throw err
        
        res.status(200)
        .json({
            statusCode: 200,
            statusMsg: 'OK',
            data: rows
        });
           
    });

});

api.get('/getallusers/:uid',function(req,res,next){
    var sql = 'SELECT user_id,user_name FROM users WHERE user_id !='+req.params.uid;
    console.log(sql);
    connection.query(sql, function (err, rows, fields) {
        if (err) throw err
        
        res.status(200)
        .json({
            statusCode: 200,
            statusMsg: 'OK',
            data: rows
        });
           
    });

});

api.get('/deletenote/:id',function(req,res,next){
    var sql = 'UPDATE notes SET intrash = 1 WHERE notes.id = "'+req.params.id+'"';
    console.log(sql);
    connection.query(sql, function (err, rows, fields) {
        if (err) throw err
        res.status(200)
        .json({
            statusCode: 200,
            statusMsg: 'OK',
            data: rows
        });
           
    });

});

api.get('/restorenote/:id',function(req,res,next){
    var sql = 'UPDATE notes SET intrash = 0 WHERE notes.id = "'+req.params.id+'"';
    console.log(sql);
    connection.query(sql, function (err, rows, fields) {
        if (err) throw err
        
        res.status(200)
        .json({
            statusCode: 200,
            statusMsg: 'OK',
            data: rows
        });
           
    });

});

api.post('/updatenote',function(req,res,next){
    console.log(req.body);
    var sql = 'UPDATE notes SET notes.title = "'+req.body.title+'" , notes.body = "'+req.body.description+'"  WHERE notes.id = "'+req.body.id+'"';
    console.log(sql);
    connection.query(sql, function (err, rows, fields) {
        if (err) throw err
        res.status(200)
        .json({
            statusCode: 200,
            statusMsg: 'OK',
            data: rows
        });
           
    });

});

api.post('/newnote',function(req,res,next){
    console.log(req.body);
    var sql = 'INSERT INTO notes (id, title, body, ower, createon, intrash) VALUES (NULL, "'+req.body.title+'", "'+req.body.description+'" , "'+req.body.uid+'", CURRENT_TIMESTAMP, "0")';
    console.log(sql);
    connection.query(sql, function (err, rows, fields) {
        if (err) throw err
        res.status(200)
        .json({
            statusCode: 200,
            statusMsg: 'OK',
            data: rows
        });
           
    });

});

api.post('/sharenote',function(req,res,next){
    console.log(req.body);
    var sql = 'INSERT INTO sharewith (id, note_id, ower_id, shareby_id, sharewith_id) VALUES (NULL, "'+req.body.noteid+'", "'+req.body.owerid+'", "'+req.body.sharebyid+'", "'+req.body.sharewithid+'")';  
    
    console.log(sql);
    connection.query(sql, function (err, rows, fields) {
        if (err) throw err
        res.status(200)
        .json({
            statusCode: 200,
            statusMsg: 'OK',
            data: rows
        });
           
    });

});

api.get('/getsharednotes/:uid',function(req,res,next){
    var sql='SELECT sharewith.id , sharewith.note_id , notes.title, sharewith.sharewith_id, users.user_name FROM sharewith INNER JOIN notes on (sharewith.shareby_id='+req.params.uid+' and notes.id=sharewith.note_id) INNER JOIN users on sharewith.sharewith_id=users.user_id WHERE notes.intrash=0';
    console.log(sql);
    connection.query(sql, function (err, rows1, fields) {
        if (err) throw err
        
        res.status(200)
        .json({
            statusCode: 200,
            statusMsg: 'OK',
            data: rows1
        });
           
    });

});

api.get('/revokenoteaccess/:snid/:nid/:sbid',function(req,res,next){
    var sql='DELETE FROM sharewith WHERE sharewith.id='+req.params.snid;
    console.log(sql);
    connection.query(sql, function (err, rows, fields) {
        if (err) throw err
        
        res.status(200)
        .json({
            statusCode: 200,
            statusMsg: 'OK',
            data: rows
        });
           
    });

    var sql1='DELETE FROM sharewith WHERE shareby_id = '+req.params.sbid+' and note_id = '+req.params.nid+'';
    console.log(sql1);
    connection.query(sql1, function (err1, rows1, fields1) {
        if (err1) throw err1
        
        res.status(200)
        .json({
            statusCode: 200,
            statusMsg: 'OK',
            data: rows1
        });
           
    });

});

api.get('*',function(req,res){
    res.send('Sorry invalid URL');
});

// connection.end();

module.exports = api;
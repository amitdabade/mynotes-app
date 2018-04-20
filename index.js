var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var api = require('./api.js');


app.get("/", function(req, res){
    res.send("welcome!!");
    
});
app.use('/api/v1',api);
app.listen(port);
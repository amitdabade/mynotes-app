var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var api = require('./api.js');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function(req, res){
    res.send("welcome!!");
    
});
app.use('/api/v1',api);
app.listen(port);
var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var api = require('./api.js');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('assets'));
app.use(express.static('views'));
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));

app.use('/api/v1',api);
app.listen(port);
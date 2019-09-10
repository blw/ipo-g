var express = require('express');
var app = express();

app.use(express.static('images'));

app.use('/', express.static(__dirname + '/public'));

app.listen(3000);

console.log("Open 127.0.0.1:3000")
var express = require('express');
var app = express();

app.use('/', express.static(__dirname + '/public'));

app.listen(3000);

app.get('/test', function (req, res) {
  res.send({lat: 123, long: 234})
})


console.log("Open 127.0.0.1:3000")
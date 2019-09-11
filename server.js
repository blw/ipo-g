var express = require('express');
var app = express();

app.use('/', express.static(__dirname + '/public'));

app.listen(3000);

app.get('/test', function (req, res) {
    let fetch = require('node-fetch');

    function getBrowserLocation() {
        if(navigator.geolocation) {
            return navigator.geolocation.getCurrentPosition((position => position.coords));
        }
    }

    async function fetchCarMetaData() {
        return getData('https://owner-api.teslamotors.com/api/1/vehicles/71284801563121906/data_request/drive_state')
    }

    async function getData(url = '') {
        // Default options are marked with *
        return fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            //mode: 'cors', // no-cors, cors, *same-origin
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 828d44169285ab9ada06630513ee37bc6447fbe82424878ca3d1d61dfff24a04',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            //redirect: 'follow', // manual, *follow, error
            //referrer: 'no-referrer', // no-referrer, *client
            //body: JSON.stringify(data), // body data type must match "Content-Type" header
        }).then(response => response.json()); // parses JSON response into native JavaScript objects
    }
  res.send(fetchCarMetaData());
})


console.log("Open 127.0.0.1:3000")
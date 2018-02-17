'use strict';

const https = require('https');

var i = 0;
var arr = [];

let interval = setInterval(() => {
    https.get('https://api.binance.com/api/v1/time', (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            var jsonRes = JSON.parse(data);
            var deltaMS = Date.now() - jsonRes.serverTime;
            console.log((i + 1) + ": " + deltaMS + "MS");
            arr.push(deltaMS);
            i++;

            if (i === 10) {
                clearInterval(interval);
                var sum = 0;
                for (var j = 0; j < arr.length; j++) {
                    sum += arr[j];
                }

                console.log("Binance avarage delay: " + sum / arr.length + "MS");
            }
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}, 2000);

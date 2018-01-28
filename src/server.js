const path = require('path');
const express = require('express');
const app = express();
const request = require('request');
const sslRedirect = require('heroku-ssl-redirect');
const PORT = process.env.PORT || 8080;

app.use(sslRedirect());

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.get('/styles', function (request, response) {
  response.sendFile(__dirname + '/public/styles.css');
});
app.get('/script', function (request, response) {
  response.sendFile(__dirname + '/public/script.js');
});

app.get('/favicon', function (request, response) {
  response.sendFile(__dirname + '/public/favicon.ico');
});
app.get('/other/dust_scratches.png', function (request, response) {
    response.sendFile(__dirname + '/public/other/dust_scratches.png');
});

app.listen(PORT, error => (
  error
    ? console.error(error)
    : console.info(`Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`)
));


app.post('/diffBTC', function (req, res) {
  var queryBTC = "https://blockchain.info/charts/difficulty?timespan=1days&format=json";  
  var podatki = "";
  var odg = {};
  request({
      method: 'GET',
      uri: queryBTC,
      encoding: null
    }, function (error, response, body) {
    }).on('data', function (data) {
      podatki += data;
    }).on('error', function (error) {
      console.log(error);
      odg.difficultyBTC = -1;
      res.send(odg);
    }).on('end', function () {
      if (podatki[0] != "<") {
        var odgovor = JSON.parse(podatki);
        odg.difficultyBTC = odgovor.values[0].y;
        res.send(odg);        
      }
    });
});

app.post('/diffLTC', function (req, res) {  
  var queryLTC = "http://explorer.litecoin.net/chain/Litecoin/q/getdifficulty";
  var podatki = "";
  var odg = {};
  request({
      method: 'GET',
      uri: queryLTC,
      encoding: null
    }, function (error, response, body) {
    }).on('data', function (data) {
      podatki += data;
    }).on('error', function (error) {
      console.log(error);
      odg.difficultyLTC = -1;
      res.send(odg);
    }).on('end', function () {
      if (podatki[0] != "<") {
        var odgovor = JSON.parse(podatki);
        odg.difficultyLTC = odgovor;
        res.send(odg);        
      }
    });
});

app.post('/diffETH', function (req, res) {  
  var queryETH = "https://www.etherchain.org/api/difficulty";
  var podatki = "";
  var odg = {};
  request({
      method: 'GET',
      uri: queryETH,
      encoding: null
    }, function (error, response, body) {
    }).on('data', function (data) {
      podatki += data;
    }).on('error', function (error) {
      console.log(error);
      odg.difficultyETH = -1;
      res.send(odg);
    }).on('end', function () {
      if (podatki[0] != "<") {
        var odgovor = JSON.parse(podatki);
        odg.difficultyETH = odgovor;
        res.send(odg);        
      }
    });
});

app.post('/price', function (req, res) {
  var querry = "https://api.coinmarketcap.com/v1/ticker/?limit=0";
  var podatki = "";
  var odg = {};
  request({
      method: 'GET',
      uri: querry,
      encoding: null
    }, function (error, response, body) {
    }).on('data', function (data) {
      podatki += data;
    }).on('error', function (error) {
      console.log(error);
      odg.valueBTC = -1;
      odg.valueETH = -1;
      odg.valueLTC = -1;
      res.send(odg);
    }).on('end', function () {
      if (podatki[0] != "<") {
        var odgovor = JSON.parse(podatki);
        for (var i = 0; i < odgovor.length; i++) {
          if (odgovor[i].symbol === "BTC") {
            odg.valueBTC = odgovor[i].price_usd;
          }
        } for (var i = 0; i < odgovor.length; i++) {
          if (odgovor[i].symbol === "ETH") {
            odg.valueETH = odgovor[i].price_usd;
          }
        } for (var i = 0; i < odgovor.length; i++) {
          if (odgovor[i].symbol === "LTC") {
            odg.valueLTC = odgovor[i].price_usd;
          }
        }
        res.send(odg);
      } else {
        odg.valueBTC = -1;
        odg.valueETH = -1;
        odg.valueLTC = -1;
        res.send(odg);
      }
    });
});

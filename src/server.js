const path = require('path');
const express = require('express');
const app = express();
const request = require('request');
const sslRedirect = require('heroku-ssl-redirect');
var PORT = process.env.PORT || 8080;

app.use(sslRedirect(['production'], 301));


app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});
app.get('/converter', function (request, response) {
    response.sendFile(__dirname + '/public/converter.html');
});

app.get('/styles', function (request, response) {
  response.sendFile(__dirname + '/public/styles.css');
});
app.get('/stylesConverter', function (request, response) {
    response.sendFile(__dirname + '/public/stylesConverter.css');
});
app.get('/script', function (request, response) {
  response.sendFile(__dirname + '/public/script.js');
});

app.get('/scriptConverter', function (request, response) {
    response.sendFile(__dirname + '/public/scriptConverter.js');
});


app.get('/favicon', function (request, response) {
  response.sendFile(__dirname + '/public/favicon.ico');
});
app.get('/other/dust_scratches.png', function (request, response) {
  response.sendFile(__dirname + '/public/other/dust_scratches.png');
});


app.get('/other/LogoShort.png', function (request, response) {
    response.sendFile(__dirname + '/public/other/LogoShort.png');
});

app.get('/other/LogoNav.png', function (request, response) {
    response.sendFile(__dirname + '/public/other/LogoNav.png');
});

app.get('/other/CrypsterLogo_onWhite.jpg', function (request, response) {
  response.sendFile(__dirname + '/public/other/CrypsterLogo_onWhite.jpg');
});

app.get('/other/sitemap.txt', function (request, response) {
  response.sendFile(__dirname + '/public/other/sitemap.txt');
});
app.get('/other/BTC.svg', function (request, response) {
  response.sendFile(__dirname + '/public/other/BTC.svg');
});
app.get('/other/LTC.svg', function (request, response) {
  response.sendFile(__dirname + '/public/other/LTC.svg');
});

app.get('/other/ETH.svg', function (request, response) {
  response.sendFile(__dirname + '/public/other/ETH.svg');
});

app.get('/other/ZEC-alt.svg', function (request, response) {
  response.sendFile(__dirname + '/public/other/ZEC-alt.svg');
});
app.get('/other/XMR.svg', function (request, response) {
    response.sendFile(__dirname + '/public/other/XMR.svg');
});
app.get('/other/LogoOnly.png', function (request, response) {
    response.sendFile(__dirname + '/public/other/LogoOnly.png');
});
app.get('/other/LogoSign.png', function (request, response) {
    response.sendFile(__dirname + '/public/other/LogoSign.png');
});
app.get('/other/LogoImg.png', function (request, response) {
    response.sendFile(__dirname + '/public/other/LogoImg.png');
});
app.get('/other/LogoImgOpacity.png', function (request, response) {
    response.sendFile(__dirname + '/public/other/LogoImgOpacity.png');
});
app.get('/other/facebook_thumbnail', function (request, response) {
  response.sendFile(__dirname + '/public/other/facebook_thumbnail.png');
});
app.get('/other/MyriadProRegular.ttf', function (request, response) {
    response.sendFile(__dirname + '/public/other/MyriadProRegular.ttf');
});
app.get('/other/crypsterProfile.jpg', function (request, response) {
    response.sendFile(__dirname + '/public/other/crypsterProfile.jpg');
});
app.get('/other/thumbnail.png', function (request, response) {
    response.sendFile(__dirname + '/public/other/thumbnail.png');
});
app.get('/other/thumbnailConverter.png', function (request, response) {
    response.sendFile(__dirname + '/public/other/thumbnailConverter.png');
});









app.listen(PORT, error => (
  error
    ? console.error(error)
    : console.info(`Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`)
));


app.post('/diffBTC', function (req, res) {
  var queryBTC = "https://blockchain.info/charts/difficulty?timespan=2days&format=json";
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

app.post('/diffZEC', function (req, res) {
  var queryZEC = "https://api.zcha.in/v2/mainnet/network";
  var podatki = "";
  var odg = {};
  request({
    method: 'GET',
    uri: queryZEC,
    encoding: null
  }, function (error, response, body) {
  }).on('data', function (data) {
    podatki += data;
  }).on('error', function (error) {
    console.log(error);
    odg.difficultyZEC = -1;
    res.send(odg);
  }).on('end', function () {
    if (podatki[0] != "<") {
      var odgovor = JSON.parse(podatki);
      odg.difficultyZEC = odgovor.difficulty;
      res.send(odg);
    }
  });
});

app.post('/moneroInfo', function (req, res) {
  var queryXMR = "https://moneroblocks.info/api/get_stats";
  var podatki = "";
  var odg = {};
  request({
    method: 'GET',
    uri: queryXMR,
    encoding: null
  }, function (error, response, body) {
  }).on('data', function (data) {
    podatki += data;
  }).on('error', function (error) {
    console.log(error);
    odg = -1;
    res.send(odg);
  }).on('end', function () {
    if (podatki[0] != "<") {
      var odgovor = JSON.parse(podatki);
      odg.difficulty = Math.round(odgovor.difficulty);
      odg.blockReward = odgovor.last_reward/Math.pow(10, 12);
      res.send(odg);
    }
  });
});

app.post('/cards', function (req, res) {
  var cards = "https://www.cryptocompare.com/api/data/miningequipment/";
  var podatki = "";
  var odg = {};
  request({
    method: 'GET',
    uri: cards,
    encoding: null
  }, function (error, response, body) {
  }).on('data', function (data) {
    podatki += data;
  }).on('error', function (error) {
    console.log(error);
    odg.cards = -1;
    odg.ASIC = -1;
    odg.rigs = -1;
    res.send(odg);
  }).on('end', function () {
    if (podatki[0] != "<") {
      odg.cards = [];
      odg.ASIC = [];
      odg.rigs = [];
      var odgovor = JSON.parse(podatki);
      for (key in odgovor.MiningData) {
        if (odgovor.MiningData[key].EquipmentType === "GPU") {
          odg.cards.push(odgovor.MiningData[key]);
        }
        else if (odgovor.MiningData[key].EquipmentType === "ASIC") {
          odg.ASIC.push(odgovor.MiningData[key]);
        }
        else if (odgovor.MiningData[key].EquipmentType === "Rig") {
          odg.rigs.push(odgovor.MiningData[key]);
        }
      }
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
    odg.valueZEC = -1;
    odg.valueXMR = -1;
    res.send(odg);
  }).on('end', function () {
    if (podatki[0] != "<") {
      var odgovor = JSON.parse(podatki);
      for (var i = 0; i < odgovor.length; i++) {
        if (odgovor[i].symbol === "BTC") {
          odg.valueBTC = odgovor[i].price_usd;
        } else if (odgovor[i].symbol === "ETH") {
          odg.valueETH = odgovor[i].price_usd;
        } else if (odgovor[i].symbol === "LTC") {
          odg.valueLTC = odgovor[i].price_usd;
        } else if (odgovor[i].symbol === "ZEC") {
          odg.valueZEC = odgovor[i].price_usd;
        }else if (odgovor[i].symbol === "XMR") {
          odg.valueXMR = odgovor[i].price_usd;
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

app.post('/exchRate', function (req, res) {
  var querry = "https://api.fixer.io/latest";
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
    odg.rate = -1;    
    res.send(odg);
  }).on('end', function () {
    if (podatki[0] != "<") {
      var odgovor = JSON.parse(podatki);   
      odg.rate = odgovor.rates.USD;
      res.send(odg);
    }
  });
});
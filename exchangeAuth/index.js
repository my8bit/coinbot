'use strict';

var BTCE = require('btc-e'),
    apiKey = process.env.API_KEY,
    secret = process.env.SECRET,
    btceTrade = new BTCE(apiKey, secret),
    btcePublic = new BTCE();

exports.btceTrade = btceTrade;
exports.btcePublic = btcePublic;
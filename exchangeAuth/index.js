'use strict';

var BTCE = require('btc-e'),
	btceTrade = new BTCE('L132OH51-YP3R4SGN-J285DJBI-LIIMAX16-RPBMBDEO',
		'628748972e63c5ee6dd77cad2eabad76d6a8031b0267c055426734d378a8574e'
	),
	btcePublic = new BTCE();

exports.btceTrade = btceTrade;
exports.btcePublic = btcePublic;
'use strict';

exports.init = function(server) {
    var io = require('socket.io').listen(server),
        moment = require('moment'),
        BTCE = require('btc-e'),
        btceTrade = new BTCE('L132OH51-YP3R4SGN-J285DJBI-LIIMAX16-RPBMBDEO',
            '628748972e63c5ee6dd77cad2eabad76d6a8031b0267c055426734d378a8574e'
        ),
        btcePublic = new BTCE();

    io.sockets.on('connection', function(socket) {
        socket.on('fromClient', function() {
            function getCurrencyWithInterval() {
                btcePublic.ticker('ltc_usd', function(err, data) {
                    try {
                        socket.emit('updateCurrency', {
                            cur: data
                        });
                    } catch (e) {
                        console.error(e);
                        socket.emit('Server error', {
                            error: e
                        });
                    }
                });
            }
            getCurrencyWithInterval();
            setTimeout(function() {
                getAllOrders(socket);
            }, 2100);
        });

        function getAllOrders(socket) {
            btceTrade.activeOrders('ltc_usd', function(err, data) {
                if (err) console.log(err);
                console.log(data);
                socket.emit('updateOrders', {
                    data: data
                });
            });
        }

        socket.on('giveMeActiveOrders', function() {
            btceTrade.activeOrders('ltc_usd', function(err, data) {
                console.log(data);
                socket.emit('yourOrdersIs', {
                    data: data
                });
            });
        });

        socket.on('cancelOrderNo', function(data) {
            btceTrade.cancelOrder(parseInt(data.orderNumber), function(err, data) {
                console.log('Order was canceld!');
                console.log(data);
                if (data) {
                    console.log(data);
                } else {
                    console.log('But no respond');
                }
                if (err) console.log(err);
            });
            setTimeout(function() {
                getAllOrders(socket);
            }, 2100);
        });

        socket.on('buyCoins', function(data) {
            var rate = parseFloat(data.rate).toFixed(5),
                amount = parseFloat(data.amount).toFixed(5);
            btceTrade.trade('ltc_usd', 'buy', rate, amount, function(err, data) {
                if (err) {
                    console.log(err);
                    socket.emit('Server error', {
                        error: err
                    });
                }
                console.log('Order was created');
                console.log(data);
                setTimeout(function() {
                    getAllOrders(socket);
                }, 2100);
            });
        });
    });
};
exports.mochaCoverage = function() {
    return true;
};
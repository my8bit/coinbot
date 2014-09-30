'use strict';

exports.init = function(server) {
    var io = require('socket.io').listen(server),
        moment = require('moment'),
        btceTrade = require('./../exchangeAuth').btceTrade,
        btcePublic = require('./../exchangeAuth').btcePublic,
        bot = require('./../bot')

    io.sockets.on('connection', function(socket) {
        function getAllOrders() {
            btceTrade.activeOrders('ltc_usd', function(err, data) {
                if (err) console.log(err);
                //console.log(data);
                socket.emit('updateOrders', {
                    data: data
                });
            });
        }

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
            var currencyInterval = setInterval(getCurrencyWithInterval, 10000);
            getAllOrders();
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
                setTimeout(getAllOrders, 2100);
            });
            /*setTimeout(function() {
                getAllOrders(socket);
            }, 2100);*/
            //getAllOrders();
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
                /*setTimeout(function() {
                    getAllOrders(socket);
                }, 2100);*/
                setTimeout(getAllOrders, 2100);
            });
        });
    });
};
exports.mochaCoverage = function() {
    return true;
};
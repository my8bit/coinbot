'use strict';

exports.init = function(server) {
    var io = require('socket.io').listen(server),
        moment = require('moment'),
        btceTrade = require('./../exchangeAuth').btceTrade,
        btcePublic = require('./../exchangeAuth').btcePublic,
        bot = require('./../bot'),
        Q = require('q'),
        logError = function(err) {
            if (err) {
                console.log(err);
                return true;
            } else {
                return false;
            }
        };

    io.sockets.on('connection', function(socket) {
        function getAllOrders() {
            btceTrade.activeOrders('ltc_usd', function(err, data) {
                if (logError(err)) {
                    console.trace('activeOrders');
                    return;
                }
                //console.log(data);
                socket.emit('updateOrders', {
                    data: data
                });
            });
        }

        socket.on('fromClient', function() {
            console.log('Connected?!');
        });

        function getCurrencyWithInterval() {
            //var deferred = Q.defer();
            btcePublic.ticker('ltc_usd', function(err, data) {
                if (logError(err)) {
                    console.trace('ticker');
                    return;
                }
                socket.emit('updateCurrency', {
                    cur: data
                });
                //bot.ticker(data);
                //    deferred.resolve;
                setTimeout(getAllOrders, 5100);
            });
            //  return deferred.promise;
            //getAllOrders();
        }
        //getCurrencyWithInterval().then(getAllOrders());
        var currencyInterval = setInterval(getCurrencyWithInterval, 10000);
        //getAllOrders();

        socket.on('cancelOrderNo', function(data) {
            btceTrade.cancelOrder(parseInt(data.orderNumber), function(err, data) {
                console.log('Order was canceld!');
                console.log(data);
                if (logError(err)) return;
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
                if (logError(err)) return;
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
'use strict';

exports.init = function(server) {
    var io = require('socket.io').listen(server),
        moment = require('moment'),
        //fs = require('fs'),
        //currentNonce = fs.existsSync('nonce628748972e63c5ee6dd77cad2eabad76d6a8031b0267c055426734d378a8574e.json') ? JSON.parse(fs.readFileSync('nonce628748972e63c5ee6dd77cad2eabad76d6a8031b0267c055426734d378a8574e.json')) : 0,
        BTCE = require('btc-e'),
        btceTrade = new BTCE('L132OH51-YP3R4SGN-J285DJBI-LIIMAX16-RPBMBDEO',
            '628748972e63c5ee6dd77cad2eabad76d6a8031b0267c055426734d378a8574e'
            /*, {
                nonce: function() {
                    currentNonce++;
                    fs.writeFile('nonce628748972e63c5ee6dd77cad2eabad76d6a8031b0267c055426734d378a8574e.json', currentNonce);
                    return currentNonce;
                }
            }*/
        ),
        btcePublic = new BTCE();
    //ordersStore = [];

    // Provide a nonce generation function as the third parameter if desired.
    // The function must provide a number that is larger than the one before and must not
    // be larger than the 32-bit unsigned integer max value of 4294967294.

    io.sockets.on('connection', function(socket) {
        socket.on('fromClient', function() {
            function getCurrencyWithInterval() {
                btcePublic.ticker('ltc_usd', function(err, data) {
                    //var date = new Date();
                    //if (!data) return;
                    try {
                        //                  console.log('{ ' + data.ticker.last + ' : ' + moment() + ' }');
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
            upadteOrder();
            //getAllOrders(socket);

            function upadteOrder() {
                btceTrade.activeOrders('ltc_usd', function(err, data) {
                    //console.log(data);
                    socket.emit('updateOrders', {
                        data: data
                    });
                });
            }

            //var getCurrencyInterval = setInterval(getCurrencyWithInterval, 10000);
            //var updateOrderInterval = setInterval(upadteOrder, 10000);
        });


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
            //Fix DEFER THIS SHIT!!!!!
            setTimeout(function() {
                getAllOrders(socket);
            }, 2100);
        });

        function getAllOrders(socket) {
            btceTrade.activeOrders('ltc_usd', function(err, data) {
                console.log(data);
                socket.emit('updateOrders', {
                    data: data
                });
            });
        }
        //cancelOrderNo
        socket.on('buyCoins', function(data) {
            var rate = parseFloat(data.rate).toFixed(5),
                amount = parseFloat(data.amount).toFixed(5);
            //  console.log(rate, amount);
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
            /*
            btceTrade.activeOrders(function(err, info) {
                //console.log(info);
                //moment().isBefore('2010-10-21');
                //var now = moment().format('m');
                var orderStore = info;
                for (var orderNumber in orderStore) {
                    if (orderStore.hasOwnProperty(orderNumber)) {
                        var ordersTime = moment(orderStore[orderNumber].timestamp_created * 1000).fromNow();
                        console.log('How time'); //.substr(0, 2) * 1
                        console.log(ordersTime);
                        if (!isNaN(ordersTime.substr(0, 2) * 1) && ordersTime > 10) {
                            btceTrade.cancelOrder(orderNumber, cancelFn);
                        }
                    }
                }

                function cancelFn(err, data) {
                    console.log(data);
                }
                ordersStore.push(info);
                socket.emit('updateCurrency', {
                    cur: info
                });
            });
            */
        });
    });
    /*
    io.sockets.on('getCur', function(socket) {
        console.log('getCur ' + socket);
        btceTrade.getInfo(function(err, info) {
            console.log(info);
            ordersStore.push(info);
            socket.emit('updateCurrency', {
                cur: info
            });
        });
    });
    */
};
exports.mochaCoverage = function() {
    return true;
};
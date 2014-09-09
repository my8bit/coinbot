exports.init = function(server) {
    var io = require('socket.io').listen(server); // this tells socket.io to use our express server
    var sk;

    io.sockets.on('connection', function (socket) {
        //console.log('A new user connected!');
        sk = socket;
        socket.emit('info', { msg: 'The world is round, there is no up or down.' });
        socket.emit('toClient', { msg: 'Test message to client.' });
        socket.on('fromClient', function (answr) {
            console.log('test socket fired' + socket.data);
            function getCurrencyWithInterval() {
                btcePublic.ticker("ltc_usd", function(err, data) {
                //btceTrade.getInfo(function(err, info) {
                    console.log("getInfo triggered");
                    //console.log(err, info);
                    socket.emit('updateCurrency', { cur: data });
                    //sk.emit('updateCurrency', { cur: info });
                });
            }
            var interval = setInterval(getCurrencyWithInterval, 10000);
            //socket.emit('toClient', { msg: 'The world is round, there is no up or down.' });
        });
    });
/*
    io.sockets.on('fromClient', function (socket) {
        console.log('test socket fired' + socket.data);
        //socket.emit('toClient', { msg: 'The world is round, there is no up or down.' });
    });

*/    var BTCE = require('btc-e');

    var btceTrade = new BTCE("L132OH51-YP3R4SGN-J285DJBI-LIIMAX16-RPBMBDEO", "628748972e63c5ee6dd77cad2eabad76d6a8031b0267c055426734d378a8574e"),
    // No need to provide keys if you're only using the public api methods.
    btcePublic = new BTCE();
    
    // Public API method call.
    // Note: Could use "btceTrade" here as well.
    
    btcePublic.ticker("ltc_usd", function(err, data) {
        console.log(err, data);
    });
    
    // Trade API method call.
    io.sockets.on('getCur', function (socket) {
        console.log('getCur');
/*        btceTrade.getInfo(function(err, info) {
            console.log("getInfo triggered");
            //console.log(err, info);
            socket.emit('updateCurrency', { cur: info });
            //sk.emit('updateCurrency', { cur: info });
        });
*/    });

    btceTrade.getInfo(function(err, info) {
        console.log("getInfo triggered");
        //console.log(err, info);
        io.sockets.emit('updateCurrency', { cur: info });
        //sk.emit('updateCurrency', { cur: info });
    });

};

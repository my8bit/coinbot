
/*
 * GET home page.
 */
//var BTCE = require('btc-e');
//var io = require('socket.io').listen(3000); // this tells socket.io to use our express server
//console.log(server);

exports.getTicket = function(n) {
    return function(req, req) {
        console.log(n);
    };
};

exports.index = function(req, res){
    // var io = require('socket.io').listen(server); // this tells socket.io to use our express server
    
/*    io.sockets.on('connection', function (socket) {
        console.log('A new user connected!');
        socket.emit('info', { msg: 'The world is round, there is no up or down.' });
    });
*/
    
    res.render('index', { title: 'Express' });

};
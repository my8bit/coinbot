require.config({
    paths: {
        "jquery": "jquery/dist/jquery.min",
        "bootstrap": "bootstrap/dist/js/bootstrap.min",
        "socketio": "../socket.io/socket.io"
    },
    shim: {
        "bootstrap": { deps: ["jquery"] }
    }
});


requirejs([
    'jquery', 
    'bootstrap',
    'socketio',
    ], function($, bootstrap, socketio){
        //this is where all the site code should begin
        //var socket = socketio.connect(); 
        var io = socketio();
        var socket = io.connect(); 
//      console.log(socketio);
        // if we get an "info" emit from the socket server then console.log the data we recive
        socket.on('info', function (data) {
            console.log(data);
        });
        socket.on('connect', function(data) {
            console.log('connected');
//            socket.emit('fromClient', { msg: "Emitted from client" });
        });

        function onload (argument) {
            socket.on('toClient', function (data) { console.log(data); });
            socket.emit('fromClient', { msg: "Emitted from client" });
            socket.on('updateCurrency', function(data) {
                //console.log(data);
                $('#currency').text("Currency is - " +  data.cur.ticker.last)
            });
 /*           socket.emit('getCur', function(answr) {
                answr.on('updateCurrency', function(data) {
                    console.log(data);
                    //$('#currency').text()
                });
                //console.log(data);
                //$('#currency').text()
            });          
 */       }
        $(onload);

        console.log("Done!");
        return {};
});

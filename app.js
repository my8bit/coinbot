
/**
 * Module dependencies.
 */

var express    = require('express');
var routes = require('./routes');
var user   = require('./routes/user');
var http   = require('http');
var path   = require('path');

var app = express();
var server = http.createServer(app);

// all environments
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ipaddress', process.env.OPENSHIFT_NODEJS_IP || 'localhost');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/getTicket', routes.getTicket);

app.get('/users', user.list);

/*var server = */
//app.listen(process.env.OPENSHIFT_NODEJS_PORT);
console.log(process.env.OPENSHIFT_NODEJS_PORT);
console.log(process.env.OPENSHIFT_NODEJS_IP);
//var server = app.listen();

//TODO realy stupid name - refactor
var buySellFn = require('./buysellfn');
buySellFn.init(server);
server.listen(app.get('port'), app.get('ipaddress'));
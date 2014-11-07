/**
 * Module dependencies.
 */

'use strict';

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    buySellFn = require('./buysellfn'),

    app = express(),
    server = http.createServer(app),
    port = process.env.OPENSHIFT_NODEJS_PORT || 8181,
    ipAddress = process.env.OPENSHIFT_NODEJS_IP || 'localhost',
    basicAuthLogin = process.env.BASIC_AUTH_LOGIN,
    basicAuthPass = process.env.BASIC_AUTH_PASS;

// all environments
app.set('port', port);
app.set('ipaddress', ipAddress);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if (basicAuthLogin && basicAuthPass) {
    app.use(express.basicAuth(basicAuthLogin, basicAuthPass));

}

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

//TODO realy stupid name - refactor
buySellFn.init(server);

server.listen(app.get('port'), app.get('ipaddress'));
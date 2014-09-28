//TODO Invastigate this case
//var assert = require('chai').assert;
'use strict';
//TODO Figure out how to create a coverage

//var assert = require('assert');
var assert = require('chai').assert;
describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1, 2, 3].indexOf(0));
        });
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1, 2, 3].indexOf(4));
        });
    });
});

//var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:8080';

var options = {
    transports: ['websocket'],
    'force new connection': true
};


describe('Sockets on server', function() {
    /* Test 1 - A Single User */
    it('should recive ticker on connect', function() {
        var client = io.connect(socketURL, options);
        client.emit('fromClient', {
            msg: 'Emitted from client'
        });
        client.on('updateCurrency', function(data) {
            assert.isDefined(data.hasOwnProperty('ticker'));
        });
        client.on('updateOrders', function(data) {
            console.log(data);
            assert.isDefined(data.data);
        });

    });

    it('should do magic', function() {
        //buySellFn.init(server);
    });

});

describe('buySellFn module test', function() {
    /*
    var buySellFn = require('./../buysellfn');

    var express = require('express');
    var http = require('http');
    var app = express();
    var server = http.createServer(app);
    beforeEach(function() {
        server = http.createServer(app);
    });
    it('should do magic', function() {
        buySellFn.init(server);
    });
*/
});
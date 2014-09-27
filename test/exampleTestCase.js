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

var chatUser1 = {
    'name': 'Tom'
};

describe('Chat Server', function() {
    /* Test 1 - A Single User */
    it('Should broadcast new user once they connect', function() {
        var client = io.connect(socketURL, options);
        client.emit('fromClient', {
            msg: 'Emitted from client'
        });
        client.on('updateCurrency', function(data) {
            console.log(data);
            assert.ok(true, data.hasOwnProperty('ticker'));
        });

    });
});
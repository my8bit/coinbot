'use strict';

var assert = require('assert');
var cov = require('../buysellfn').mochaCoverage;

describe('Coverage', function() {
    it('should be equal true', function() {
        assert.equal(true, cov());
    });
});
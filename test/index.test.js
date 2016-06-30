'use strict';

const expect = require('expect.js');
const expandString = require('../');
const generateRange = expandString.generateRange;

describe('exports', function() {

  it('expandString() should be exported', function() {
    expect(expandString).to.be.a('function');
  });

  it('generateRange() should be exported', function() {
    expect(generateRange).to.be.a('function');
  });

});


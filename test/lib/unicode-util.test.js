'use strict';

const expect = require('expect.js');
const unicodeUtil = require('../../lib/unicode-util');
const charAt = unicodeUtil.charAt;

describe('charAt()', function() {

  it('should be exported', function() {
    expect(charAt).to.be.a('function');
  });

  it('should throw TypeError if `str` is not a string', function() {
    let wrapper = () => { charAt(); };
    expect(wrapper).to.throwError((err) => {
      expect(err).to.be.a(TypeError);
    });
  });

  it('should throw TypeError if `index` is not a number', function() {
    let wrapper = () => { charAt(''); };
    expect(wrapper).to.throwError((err) => {
      expect(err).to.be.a(TypeError);
    });
  });

  it('should return an empty string if index is out of range', function() {
    expect(charAt('abc', 5)).to.equal('');
  });

  it('should throw RangeError if index points inside a surrogate pair', function() {
    let wrapper = () => { charAt('\uD83D\uDCA9', 1); };
    expect(wrapper).to.throwError((err) => {
      expect(err).to.be.a(RangeError);
    });
  });

  it('should throw RangeError if index points to a lone low surrogate', function() {
    let wrapper = () => { charAt('a\uDCA9', 1); };
    expect(wrapper).to.throwError((err) => {
      expect(err).to.be.a(RangeError);
    });
  });

  it('should throw RangeError if index points to a lone high surrogate', function() {
    let wrapper = () => { charAt('\uD83Da', 0); };
    expect(wrapper).to.throwError((err) => {
      expect(err).to.be.a(RangeError);
    });
  });

  it('should return character at index (single code unit)', function() {
    expect(charAt('abc', 1)).to.equal('b');
  });

  it('should return character at index (multiple code units)', function() {
    expect(charAt('a\uD83D\uDCA9c', 1)).to.equal('\uD83D\uDCA9');
  });

});


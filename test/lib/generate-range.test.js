'use strict';

const expect = require('expect.js');
const generateRange = require('../../lib/generate-range');

describe('generateRange()', function() {

  it('should be exported', function() {
    expect(generateRange).to.be.a('function');
  });

  it('should throw TypeError if `first` is not a string', function() {
    let wrapper = () => { generateRange(); };
    expect(wrapper).to.throwError((err) => {
      expect(err).to.be.a(TypeError);
    });
  });

  it('should throw TypeError if `last` is not a string', function() {
    let wrapper = () => { generateRange('a'); };
    expect(wrapper).to.throwError((err) => {
      expect(err).to.be.a(TypeError);
    });
  });

  it('should throw RangeError if `first` consists of multiple characters', function() {
    let wrapper = () => { generateRange('ab', 'c'); };
    expect(wrapper).to.throwError((err) => {
      expect(err).to.be.a(TypeError);
    });
  });

  it('should throw RangeError if `last` consists of multiple characters', function() {
    let wrapper = () => { generateRange('a', 'bc'); };
    expect(wrapper).to.throwError((err) => {
      expect(err).to.be.a(TypeError);
    });
  });

  it('should throw TypeError for invalid returnArray option', function() {
    let wrapper = () => { generateRange('a', 'b', {returnArray: 42}); };
    expect(wrapper).to.throwError((err) => {
      expect(err).to.be.a(TypeError);
    });
  });

  it('should expand simple range', function() {
    let result = generateRange('a', 'o');
    expect(result).to.equal('abcdefghijklmno');
  });

  it('should expand simple range as array', function() {
    let result = generateRange('a', 'f', {returnArray: true});
    expect(result).to.be.an(Array);
    expect(result).to.eql(['a', 'b', 'c', 'd', 'e', 'f']);
  });

  it('should expand backwards range', function() {
    let result = generateRange('9', '0');
    expect(result).to.equal('9876543210');
  });

  it('should expand backwards range as array', function() {
    let result = generateRange('9', '4', {returnArray: true});
    expect(result).to.be.an(Array);
    expect(result).to.eql(['9', '8', '7', '6', '5', '4']);
  });

  it('should expand range skipping surrogate ranges', function() {
    let result = generateRange('\uD7FE', '\uE001');
    expect(result).to.equal('\uD7FE\uD7FF\uE000\uE001');
  });

  it('should expand range outside the BMP', function() {
    let result = generateRange('\uD83D\uDCA9', '\uD83D\uDCAB');
    expect(result).to.equal('\uD83D\uDCA9\uD83D\uDCAA\uD83D\uDCAB');
  });

  it('should expand range outside the BMP as array', function() {
    let result = generateRange('\uD83D\uDCA9', '\uD83D\uDCAB', {returnArray: true});
    expect(result).to.be.an(Array);
    expect(result).to.eql(['\uD83D\uDCA9', '\uD83D\uDCAA', '\uD83D\uDCAB']);
  });

});


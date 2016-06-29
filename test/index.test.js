'use strict';

const util = require('util');
const expect = require('expect.js');
const expandString = require('..');
const charAt = expandString.charAt;
const generateRange = expandString.generateRange;

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

  it('should expand a simple range', function() {
    expect(generateRange('a', 'o')).to.equal('abcdefghijklmno');
  });

  it('should expand a backwards range', function() {
    expect(generateRange('9', '0')).to.equal('9876543210');
  });

  it('should expand range skipping surrogate ranges', function() {
    expect(generateRange('\uD7FE', '\uE001')).to.equal('\uD7FE\uD7FF\uE000\uE001');
  });

});

describe('expandString()', function() {

  it('should be exported', function() {
    expect(expandString).to.be.a('function');
  });

  it('should throw TypeError for invalid ellipsis', function() {
    let wrapper = () => { expandString('', {ellipsis: 42}); };
    expect(wrapper).to.throwError((err) => {
      expect(err).to.be.a(TypeError);
    });
  });

  it('should throw TypeError for empty ellipsis', function() {
    let wrapper = () => { expandString('', {ellipsis: ''}); };
    expect(wrapper).to.throwError((err) => {
      expect(err).to.be.a(TypeError);
    });
  });

  it('should throw TypeError for invalid input', function() {
    let wrapper = () => { expandString(42); };
    expect(wrapper).to.throwError((err) => {
      expect(err).to.be.a(TypeError);
    });
  });

  it('should return an empty string for undefined input', function() {
    expect(expandString()).to.equal('');
  });

  it('should return an empty string for null input', function() {
    expect(expandString(null)).to.equal('');
  });

  it('shouldn\'t touch strings that don\'t contain any ranges', function() {
    expect(expandString('abcdef0134_')).to.equal('abcdef0134_');
  });

  it('should expand a range using default ellipsis', function() {
    expect(expandString('a-o')).to.equal('abcdefghijklmno');
  });

  it('should expand a range using custom ellipsis', function() {
    expect(expandString('a..o', {ellipsis: '..'})).to.equal('abcdefghijklmno');
  });

  it('should expand a range using custom ellipsis (shortcut)', function() {
    expect(expandString('a..o', '..')).to.equal('abcdefghijklmno');
  });

  it('should expand multiple ranges', function() {
    expect(expandString('0-9_a-ox')).to.equal('0123456789_abcdefghijklmnox');
  });

  it('should expand backwards ranges', function() {
    expect(expandString('n-d7-2')).to.equal('nmlkjihgfed765432');
  });

  it('should remove escape character', function() {
    expect(expandString('\\k')).to.equal('k');
  });

  it('should interpret an escaped escape character as literal', function() {
    expect(expandString('\\\\a')).to.equal('\\a');
  });

  it('should interpret a trailing escape character as literal', function() {
    expect(expandString('a\\')).to.equal('a\\');
  });

  it('should not expand escaped ranges', function() {
    expect(expandString('a\\-z')).to.equal('a-z');
  });

  it('should not expand escaped ranges with multi-char ellipsis', function() {
    expect(expandString('a\\..z', '..')).to.equal('a..z');
  });

  it('should interpret leading ellipsis as literal', function() {
    expect(expandString('-fgh')).to.equal('-fgh');
  });

  it('should interpret trailing ellipsis as literal', function() {
    expect(expandString('hgf-')).to.equal('hgf-');
  });

});


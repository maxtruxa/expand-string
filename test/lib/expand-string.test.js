'use strict';

const expect = require('expect.js');
const expandString = require('../../lib/expand-string');

describe('expandString()', function() {

  it('should be exported', function() {
    expect(expandString).to.be.a('function');
  });

  it('should throw TypeError for invalid input', function() {
    let wrapper = () => { expandString(42); };
    expect(wrapper).to.throwError((err) => {
      expect(err).to.be.a(TypeError);
    });
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

  it('should throw TypeError for invalid returnArray option', function() {
    let wrapper = () => { expandString('', {returnArray: 42}); };
    expect(wrapper).to.throwError((err) => {
      expect(err).to.be.a(TypeError);
    });
  });

  it('should return an empty string for undefined input', function() {
    let result = expandString();
    expect(result).to.equal('');
  });

  it('should return an empty array for undefined input', function() {
    let result = expandString(undefined, {returnArray: true});
    expect(result).to.be.an(Array);
    expect(result).to.eql([]);
  });

  it('should return an empty string for null input', function() {
    let result = expandString(null);
    expect(result).to.equal('');
  });

  it('should return an empty array for null input', function() {
    let result = expandString(null, {returnArray: true});
    expect(result).to.be.an(Array);
    expect(result).to.eql([]);
  });

  it('should shift arguments when `str` is an object', function() {
    let result = expandString({ellipsis: '-'});
    expect(result).to.eql('');
  });

  it('should return input unchanged if it doens\'t contain any ranges', function() {
    let result = expandString('abcdef0134_');
    expect(result).to.equal('abcdef0134_');
  });

  it('should expand range using default ellipsis', function() {
    let result = expandString('a-o');
    expect(result).to.equal('abcdefghijklmno');
  });

  it('should expand range using custom ellipsis', function() {
    let result = expandString('a..o', {ellipsis: '..'});
    expect(result).to.equal('abcdefghijklmno');
  });

  it('should expand range using custom ellipsis (shortcut)', function() {
    let result = expandString('a..o', '..');
    expect(result).to.equal('abcdefghijklmno');
  });

  it('should expand multiple ranges', function() {
    let result = expandString('0-9_a-ox');
    expect(result).to.equal('0123456789_abcdefghijklmnox');
  });

  it('should expand backwards range', function() {
    let result = expandString('n-d7-2');
    expect(result).to.equal('nmlkjihgfed765432');
  });

  it('should remove escape character', function() {
    let result = expandString('\\k');
    expect(result).to.equal('k');
  });

  it('should interpret escaped escape character as literal', function() {
    let result = expandString('\\\\a');
    expect(result).to.equal('\\a');
  });

  it('should interpret trailing escape character as literal', function() {
    let result = expandString('a\\');
    expect(result).to.equal('a\\');
  });

  it('should not expand escaped range', function() {
    let result = expandString('a\\-z');
    expect(result).to.equal('a-z');
  });

  it('should not expand escaped range with multi-char ellipsis', function() {
    let result = expandString('a\\..z', '..');
    expect(result).to.equal('a..z');
  });

  it('should interpret leading ellipsis as literal', function() {
    let result = expandString('-fgh');
    expect(result).to.equal('-fgh');
  });

  it('should interpret trailing ellipsis as literal', function() {
    let result = expandString('hgf-');
    expect(result).to.equal('hgf-');
  });

  it('should expand range outside the BMP', function() {
    let result = expandString('\uD83D\uDCA9-\uD83D\uDCAB');
    expect(result).to.equal('\uD83D\uDCA9\uD83D\uDCAA\uD83D\uDCAB');
  });

  it('should expand range outside the BMP as array', function() {
    let result = expandString('\uD83D\uDCA9-\uD83D\uDCAB', {returnArray: true});
    expect(result).to.be.an(Array);
    expect(result).to.eql(['\uD83D\uDCA9', '\uD83D\uDCAA', '\uD83D\uDCAB']);
  });

});


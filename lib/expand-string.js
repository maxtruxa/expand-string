'use strict';

const _ = {};
_.defaults = require('lodash.defaults');
const generateRange = require('./generate-range');
const unicodeUtil = require('./unicode-util');
const charAt = unicodeUtil.charAt;

function subCompare(str, index, cmp) {
  return str.substr(index, cmp.length) === cmp;
}

const DEFAULT_OPTIONS = {
  ellipsis: '-',
  returnArray: false
};

function expandString(str, options) {
  if (typeof str === 'object' && str !== null) {
    options = str;
    str = undefined;
  } else if (typeof options === 'string') {
    options = {ellipsis: options};
  }

  options = _.defaults({}, options, DEFAULT_OPTIONS);
  if (typeof options.ellipsis !== 'string' || !options.ellipsis.length) {
    throw new TypeError('`options.ellipsis` must be a non-empty string');
  }
  if (typeof options.returnArray !== 'boolean') {
    throw new TypeError('`options.returnArray` must be a boolean');
  }

  if (typeof str === 'undefined' || str === null) {
    str = '';
  }
  if (typeof str !== 'string') {
    throw new TypeError('`str` must be a string');
  }

  const ellipsis = options.ellipsis;

  let output = [];
  for (let i = 0; i < str.length;) {
    // get current character and move i to next index
    let ch = charAt(str, i);
    i += ch.length;

    // test for escape character; treat trailing escape character as literal
    if (ch === '\\' && i < str.length) {
      // get escaped character and move i to next index
      ch = charAt(str, i);
      i += ch.length;
      // push escaped character
      output.push(ch);
      continue;
    }

    // test for range expression; treat trailing ellipsis as literal
    if (subCompare(str, i, ellipsis) && i + ellipsis.length < str.length) {
      // get range end character and move i to next index
      i += ellipsis.length;
      let ch2 = charAt(str, i);
      i += ch2.length;
      // push range
      let range = generateRange(ch, ch2, {returnArray: true});
      Array.prototype.push.apply(output, range);
      continue;
    }

    // push plain character
    output.push(ch);
  }

  return options.returnArray ? output : output.join('');
}

module.exports = expandString;

